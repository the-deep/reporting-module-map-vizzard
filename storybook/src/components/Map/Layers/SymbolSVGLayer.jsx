import { useEffect, useState } from 'react';
import Layer from 'ol/layer';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Stroke,
  Icon,
  Fill,
  Text,
} from 'ol/style';
import Circle from 'ol/style/Circle';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
// import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import { vector } from '../Source';
import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import capital from '../assets/map-icons/capital.svg';
import city from '../assets/map-icons/city.svg';
import settlement from '../assets/map-icons/settlement.svg';
import marker from '../assets/map-icons/marker.svg';
import airport from '../assets/map-icons/airport.svg';
import borderCrossing from '../assets/map-icons/borderCrossing.svg';
import triangle from '../assets/map-icons/triangle.svg';
import idpRefugeeCamp from '../assets/map-icons/idp-refugee-camp.svg';

class CanvasLayer extends Layer {
  constructor(options) {
    super(options);

    this.features = options.features;

    this.svg = d3
      .select(document.createElement('div'))
      .append('svg')
      .style('position', 'absolute');

    this.svg.append('path').datum(this.features).attr('class', 'boundary');
  }

  getSourceState() {
    return 'ready';
  }

  render(frameState) {
    const width = frameState.size[0];
    const height = frameState.size[1];
    const projection = frameState.viewState.projection;
    const d3Projection = d3.geoMercator().scale(1).translate([0, 0]);
    let d3Path = d3.geoPath().projection(d3Projection);

    const pixelBounds = d3Path.bounds(this.features);
    const pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    const pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

    const geoBounds = d3.geoBounds(this.features);
    const geoBoundsLeftBottom = fromLonLat(geoBounds[0], projection);
    const geoBoundsRightTop = fromLonLat(geoBounds[1], projection);
    let geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
    if (geoBoundsWidth < 0) {
      geoBoundsWidth += getWidth(projection.getExtent());
    }
    const geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

    const widthResolution = geoBoundsWidth / pixelBoundsWidth;
    const heightResolution = geoBoundsHeight / pixelBoundsHeight;
    const r = Math.max(widthResolution, heightResolution);
    const scale = r / frameState.viewState.resolution;

    const center = toLonLat(getCenter(frameState.extent), projection);
    const angle = (-frameState.viewState.rotation * 180) / Math.PI;

    d3Projection
      .scale(scale)
      .center(center)
      .translate([width / 2, height / 2])
      .angle(angle);

    d3Path = d3Path.projection(d3Projection);
    d3Path(this.features);

    this.svg.attr('width', width);
    this.svg.attr('height', height);

    this.svg.select('path').attr('d', d3Path);

    return this.svg.node();
  }
}

function SymbolSVGLayer({
  map,
  source,
  data,
  symbol,
  zIndex = 1,
  opacity = 1,
  showLabels = false,
  labelColumn = '',
  scale = 1,
  scaleType = 'fixed',
  scaleScaling = 'flannery',
  scaleColumn = '',
  scaleDataMin = 0,
  scaleDataMax = 0,
  style,
}) {
  const [symbolSVGLayer, setSymbolSVGLayer] = useState(undefined);

  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
    borderCrossing,
    triangle,
    circle: 'circle',
  };

  useEffect(() => {
    if (!map) return undefined;

    let xOffset = 1;

    if (symbol === 'capital') xOffset = 1.9;

    let points = data;

    if (!Array.isArray(data)) {
      points = data.features;
    }

    const features = points.map((row) => {
      let item = row;
      if (!Array.isArray(data)) {
        item = row.properties;
        [item.lon, item.lat] = row.geometry.coordinates;
      }

      let feature;

      let size = scale;

      // absolute scaling
      let exp = 0.5;
      if (scaleScaling === 'flannery') {
        exp = 0.5716;
      }
      let r = (1 / 3.14) ** exp * (10 * scale);

      if (scaleType === 'proportional') {
        const ratio = item[scaleColumn] / scaleDataMax;
        size = scale * ratio;
        r = ((item[scaleColumn] / scaleDataMax) / 3.14) ** exp * (10 * scale);
      }

      let iconStyle;
      if (symbol === 'circle') {
        feature = new Feature(new Point(fromLonLat([item.lon, item.lat])));
        iconStyle = [
          new Style({
            image: new Circle({
              radius: r,
              fill: new Fill({
                color: rgba(style.fill),
              }),
              stroke: new Stroke({
                color: rgba(style.stroke),
                width: style.strokeWidth,
              }),
            }),
          }),
        ];
      } else {
        feature = new Feature(new Point(fromLonLat([item.lon, item.lat])));
        iconStyle = [
          new Style({
            image: new Icon({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              scale: size,
              src: symbolIcons[symbol],
            }),
          }),
        ];
      }

      if (showLabels === true) {
        let label = (item[labelColumn]) ?? '';
        if (style.labelStyle.transform === 'uppercase') label = label.toUpperCase();

        let stroke = new Stroke({
          color: 'rgba(255,255,255,0.5)',
          width: 2,
        });
        if (style.labelStyle.showHalo === false) stroke = null;

        let textAlign = 'left';
        if (style.labelStyle.textAlign) textAlign = style.labelStyle.textAlign;
        if (scaleType === 'proportional') textAlign = 'center';
        iconStyle.push(
          new Style({
            text: new Text({
              text: String(label),
              font: `${style.labelStyle.fontWeight} ${style.labelStyle.fontSize}px/1.07 ${style.labelStyle.fontFamily},sans-serif`,
              textAlign,
              offsetY: 1,
              offsetX: 7 + xOffset,
              fill: new Fill({
                color: rgba(style.labelStyle.color),
              }),
              stroke,
            }),
          }),
        );
      }

      feature.setStyle(iconStyle);
      return feature;
    });

    const vectorLayer = new OLVectorLayer({
      source: vector({ features }),
      renderers: ['SVG', 'VML', 'Canvas'],
    });

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setOpacity(opacity);

    setSymbolSVGLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [
    map,
    source,
    data,
    symbol,
    showLabels,
    labelColumn,
    scale,
    JSON.stringify(style),
    scaleColumn,
    scaleType,
    scaleScaling,
    scaleDataMin,
    scaleDataMax,
  ]);

  useEffect(() => {
    if (!symbolSVGLayer) return;
    symbolSVGLayer.setOpacity(opacity);
  }, [symbolSVGLayer, opacity]);

  useEffect(() => {
    if (!symbolSVGLayer) return;
    symbolSVGLayer.setZIndex(zIndex);
  }, [symbolSVGLayer, zIndex]);

  return null;
}

export default SymbolSVGLayer;

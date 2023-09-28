import { useEffect, useState } from 'react';
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

function SymbolLayer({
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
  const [symbolLayer, setSymbolLayer] = useState(undefined);

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
      const r = ((item[scaleColumn] / scaleDataMax) / 3.14) ** exp * (10 * scale);

      if (scaleType === 'proportional') {
        const ratio = item[scaleColumn] / scaleDataMax;
        size = scale * ratio;
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
    });

    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setOpacity(opacity);

    setSymbolLayer(vectorLayer);

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
    if (!symbolLayer) return;
    symbolLayer.setOpacity(opacity);
  }, [symbolLayer, opacity]);

  useEffect(() => {
    if (!symbolLayer) return;
    symbolLayer.setZIndex(zIndex);
  }, [symbolLayer, zIndex]);

  return null;
}

export default SymbolLayer;

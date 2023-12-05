import { useEffect, useState } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Stroke,
  Icon,
  Fill,
  Text,
} from 'ol/style';
import Overlay from 'ol/Overlay';
import Circle from 'ol/style/Circle';
import { unByKey } from 'ol/Observable';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
// import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import { numberFormatter } from '../Helpers';
import { vector } from '../Source';
import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import capital from '../assets/map-icons/capital.svg';
import city from '../assets/map-icons/city.svg';
import settlement from '../assets/map-icons/settlement.svg';
import marker from '../assets/map-icons/marker.svg';
import airport from '../assets/map-icons/airport.svg';
import borderCrossing from '../assets/map-icons/borderCrossing.svg';
import borderCrossingActive from '../assets/map-icons/borderCrossingActive.svg';
import borderCrossingPotential from '../assets/map-icons/borderCrossingPotential.svg';
import triangle from '../assets/map-icons/triangle.svg';
import idpRefugeeCamp from '../assets/map-icons/idp-refugee-camp.svg';

function SymbolLayer({
  map,
  source,
  layerId,
  data,
  symbol,
  zIndex = 1,
  opacity = 1,
  showLabels = false,
  labelColumn = '',
  labelStyle = '',
  scale = 1,
  scaleType = 'fixed',
  scaleScaling = 'flannery',
  scaleColumn = '',
  scaleDataMin = 0,
  scaleDataMax = 0,
  style,
  enableTooltips = false,
  tooltipsTitleColumn = '',
  tooltipsValueColumn = '',
  tooltipsValueLabel = '',
  primaryColor,
}) {
  const [symbolLayer, setSymbolLayer] = useState(undefined);
  const [tooltipListener, setTooltipListener] = useState(undefined);

  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
    borderCrossing,
    borderCrossingActive,
    borderCrossingPotential,
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

    function styleFunction(feature, selected = false) {
      let vectorStyle;
      const properties = feature.getProperties();
      let { strokeWidth } = properties.style;

      if (selected) {
        strokeWidth += 0.5;
      }
      if (symbol === 'circle') {
        vectorStyle = new Style({
          image: new Circle({
            radius: properties.size,
            fill: new Fill({
              color: rgba(properties.style.fill),
            }),
            stroke: new Stroke({
              color: rgba(properties.style.stroke),
              width: strokeWidth,
            }),
          }),
        });
      } else {
        vectorStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale: properties.size,
            src: symbolIcons[symbol],
          }),
        });
      }
      return vectorStyle;
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
        feature.setProperties(item);
        // eslint-disable-next-line object-shorthand
        if (r > 0) {
          feature.setProperties({ style, size: r });
        } else {
          feature.setProperties({ style, size: r, opacity: 0 });
        }
        iconStyle = [styleFunction(feature)];
      } else {
        feature = new Feature(new Point(fromLonLat([item.lon, item.lat])));
        feature.setProperties(item);
        // eslint-disable-next-line object-shorthand
        feature.setProperties({ style: style, size: size });
        iconStyle = [styleFunction(feature)];
      }

      if (showLabels === true) {
        let label = (item[labelColumn]) ?? '';
        if (style.labelStyle.transform === 'uppercase') {
          label = String(label).toUpperCase();
        }

        let stroke = new Stroke({
          color: 'rgba(255,255,255,0.5)',
          width: 2,
        });
        if (style.labelStyle.showHalo === false) stroke = null;

        let textAlign = 'left';
        if (style.labelStyle.textAlign) textAlign = style.labelStyle.textAlign;
        let yPos = 1;
        let xPos = 7 + xOffset;
        if (scale < 0.5) {
          xPos = 4 + xOffset;
          yPos = 0;
        }

        if (scaleType === 'proportional') {
          textAlign = 'center';
          xPos = 0;
        }
        let str = String(label);
        if (labelStyle === 'population') yPos = -5;

        if (labelStyle !== 'population' || item[scaleColumn] >= 5) {
          iconStyle.push(
            new Style({
              text: new Text({
                text: str,
                font: `${style.labelStyle.fontWeight} ${style.labelStyle.fontSize}px/1.07 ${style.labelStyle.fontFamily},sans-serif`,
                textAlign,
                offsetY: yPos,
                offsetX: xPos,
                fill: new Fill({
                  color: rgba(style.labelStyle.color),
                }),
                stroke,
              }),
            }),
          );
        }

        if (labelStyle === 'population' && item[scaleColumn] >= 5) {
          str = `${item[scaleColumn]}`;
          iconStyle.push(
            new Style({
              text: new Text({
                text: numberFormatter(str),
                font: `bold ${(style.labelStyle.fontSize + 2)}px/1.07 ${style.labelStyle.fontFamily},sans-serif`,
                textAlign,
                offsetY: yPos + 10,
                offsetX: xPos,
                fill: new Fill({
                  color: rgba(style.labelStyle.color),
                }),
                stroke,
              }),
            }),
          );
        }
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

    setSymbolLayer(vectorLayer);

    // tooltip popups
    let popupOverlay;
    let selected = null;

    if ((enableTooltips) && (map) && (layerId)) {
      const tt = document.createElement('div');
      tt.classList.add('tooltip');
      tt.classList.add(`tooltip_${layerId}`);
      document.body.appendChild(tt);

      popupOverlay = new Overlay({
        element: tt,
        offset: [12, -10],
      });
      map.addOverlay(popupOverlay);
      let thisId = null;
      let id = null;

      if (tooltipListener) {
        unByKey(tooltipListener);
      }

      const pv = map.on('pointermove', (event) => {
        if (event.dragging) {
          return;
        }

        const pixel = map.getEventPixel(event.originalEvent);
        vectorLayer.getFeatures(pixel).then((vectorFeatures) => {
          const feature = vectorFeatures.length ? vectorFeatures[0] : undefined;
          let str = '';
          if (vectorFeatures.length) {
            id = feature.ol_uid;
            if ((id !== thisId) || (!thisId)) {
              if (tooltipsTitleColumn) {
                str += `${feature.get(tooltipsTitleColumn)}<br/>`;
              }
              if (tooltipsValueColumn) {
                str += `<b style="color: ${rgba(style.stroke)}"> ${numberFormatter(feature.get(tooltipsValueColumn))}</b><div style="display: inline; font-size: 9px; padding-left: 3px;">${tooltipsValueLabel}</div>`;
              }
              tt.innerHTML = str;
              if (str.length > 0) tt.removeAttribute('hidden');
              selected = feature;
              if (symbol === 'circle') {
                if (selected) selected.setStyle(styleFunction(selected));
                feature.setStyle(styleFunction(feature, true));
              }
            }
            popupOverlay.setPosition(event.coordinate);
            thisId = id;
          } else {
            tt.setAttribute('hidden', true);
            if (symbol === 'circle') {
              if (selected) selected.setStyle(styleFunction(selected));
            }
            thisId = null;
            id = 0;
            tt.innerHTML = '&nbsp;';
          }
        });
      });

      setTooltipListener(pv);
    }

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);

        if ((typeof popupOverlay !== 'undefined')) {
          map.removeOverlay(popupOverlay);
        }

        if (enableTooltips) {
          const tooltips = document.querySelectorAll(`.tooltip_${layerId}`);
          tooltips.forEach((t) => {
            t.remove();
          });
        }
        if (tooltipListener) {
          unByKey(tooltipListener);
        }
      }
    };
  }, [
    map,
    layerId,
    primaryColor,
    source,
    JSON.stringify(data),
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
    enableTooltips,
    tooltipsTitleColumn,
    tooltipsValueColumn,
    tooltipsValueLabel,
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

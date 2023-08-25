import { useEffect, useState } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Stroke,
  Icon,
  Fill,
  Text,
} from 'ol/style';
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
  };

  useEffect(() => {
    if (!map) return undefined;

    let xOffset = 1;

    if (symbol === 'capital') xOffset = 1.9;

    const features = data.map((item) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([item.lon, item.lat])),
      });

      const iconStyle = [
        new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            scale,
            src: symbolIcons[symbol],
          }),
        }),
      ];

      if (showLabels === true) {
        const label = (item[labelColumn]) ?? '';

        let stroke = new Stroke({
          color: 'rgba(255,255,255,0.5)',
          width: 2,
        });
        if (style.labelStyle.showHalo === false) stroke = null;

        iconStyle.push(
          new Style({
            text: new Text({
              text: String(label),
              font: `${style.labelStyle.fontWeight} ${style.labelStyle.fontSize}px/1.07 ${style.labelStyle.fontFamily},sans-serif`,
              textAlign: 'left',
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
  }, [map, source, data, symbol, showLabels, labelColumn, scale, JSON.stringify(style)]);

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

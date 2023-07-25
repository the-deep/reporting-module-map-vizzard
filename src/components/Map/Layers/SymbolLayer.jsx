import { useEffect, useState } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Icon,
  Fill,
  Text,
} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
// import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import { vector } from '../Source';
import capital from '../assets/map-icons/capital.svg';
import city from '../assets/map-icons/city.svg';
import settlement from '../assets/map-icons/settlement.svg';
import marker from '../assets/map-icons/marker.svg';
import airport from '../assets/map-icons/airport.svg';
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
  textScale = 1,
}) {
  const [symbolLayer, setSymbolLayer] = useState(false);

  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
  };

  useEffect(() => {
    if (!map) return undefined;

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
        const label = (item[labelColumn]) || '';
        iconStyle.push(
          new Style({
            text: new Text({
              text: String(label),
              textAlign: 'left',
              offsetY: 1,
              offsetX: (13 * (scale / 1.4)),
              scale: textScale,
              fill: new Fill({
                color: '#black',
              }),
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
  }, [map, source, zIndex, data, symbol, showLabels, labelColumn, scale, textScale]);

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

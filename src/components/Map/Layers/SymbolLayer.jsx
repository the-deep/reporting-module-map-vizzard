import {
  Style, Icon, Fill, Stroke, Circle, Text,
} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import capital from '../assets/map-icons/capital.svg';
import city from '../assets/map-icons/city.svg';
import settlement from '../assets/map-icons/settlement.svg';
import marker from '../assets/map-icons/marker.svg';
import airport from '../assets/map-icons/airport.svg';
import idpRefugeeCamp from '../assets/map-icons/idp-refugee-camp.svg';

const symbolIcons = {
  capital,
  city,
  settlement,
  'idp-refugee-camp': idpRefugeeCamp,
  airport,
  marker,
};

const addCircles = (d) => {
  const iconStyle = [
    new Style({
      image: new Circle({
        radius: d.style.radius,
        fill: new Fill({
          color: d.style.fill,
        }),
        stroke: new Stroke({
          color: d.style.stroke,
          width: d.style.strokeWidth,
        }),
      }),
    }),
    new Style({
      text: new Text({
        text: d.name,
        offsetY: 2,
        scale: 2,
        fill: new Fill({
          color: '#black',
        }),
      }),
    }),
  ];

  const features = d.data.map((item) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([item.lon, item.lat])),
    });
    feature.setStyle(iconStyle);
    return feature;
  });

  return features;
};

const addSymbols = (d) => {
  let scale = 0.9;
  let font = '11px Arial';

  if (d.symbol === 'city') {
    scale = 0.6;
  }

  if (d.symbol === 'settlement') {
    scale = 0.4;
    font = '10px Arial';
  }

  if (d.symbol === 'capital') {
    scale = 0.9;
    font = 'bold 11px Arial';
  }

  const { showLabels } = d;

  const features = d.data.map((item) => {
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
          src: symbolIcons[d.symbol],
        }),
      }),
    ];

    if (showLabels === true) {
      iconStyle.push(
        new Style({
          text: new Text({
            text: item.title,
            textAlign: 'left',
            font,
            offsetY: 1,
            offsetX: 8,
            scale: 1,
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

  return features;
};

export { addCircles, addSymbols };

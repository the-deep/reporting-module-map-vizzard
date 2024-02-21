import {
  Vector as VectorSource,
  OSM,
  XYZ,
} from 'ol/source';

export function numberFormatter(number) {
  if (number === '-') return '-';
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(number);
}

export function mask() {
  return new VectorSource({ wrapX: false });
}

export function osm() {
  return new OSM();
}

export function vector({ features }) {
  return new VectorSource({
    features,
  });
}

export function xyz({ url, attributions, maxZoom }) {
  return new XYZ({ url, attributions, maxZoom });
}

export function rgba(rgb) {
  if (rgb && typeof rgb !== 'undefined' && rgb.a >= 0) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
  }
  return null;
}

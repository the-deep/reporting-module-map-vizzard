import {
    Vector as VectorSource,
    OSM,
    XYZ,
} from 'ol/source';
import {
    Geometry,
} from 'ol/geom';

export function numberFormatter(num: number | '-') {
    if (num === '-') {
        return '-';
    }
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num);
}

export function mask() {
    return new VectorSource({ wrapX: false });
}

export function osm() {
    return new OSM();
}

export function vector<T extends Geometry>({ features }) {
    return new VectorSource<T>({
        features,
    });
}

export function xyz({ url, attributions, maxZoom }) {
    return new XYZ({ url, attributions, maxZoom });
}

export function rgba(rgb: { r: number; g: number; b: number; a: number} | undefined) {
    if (rgb && typeof rgb !== 'undefined' && rgb.a >= 0) {
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    }
    return null;
}

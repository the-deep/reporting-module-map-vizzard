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

type VectorSourceOptions<T extends Geometry> = NonNullable<
    ConstructorParameters<typeof VectorSource<T>>[number]
>;
export function vector<T extends Geometry>(options: Pick<VectorSourceOptions<T>, 'features'>) {
    return new VectorSource<T>({
        features: options.features,
    });
}

type XYZOptions = NonNullable<ConstructorParameters<typeof XYZ>[number]>;
export function xyz(options: Pick<XYZOptions, 'url' | 'attributions' | 'maxZoom'>) {
    return new XYZ(options);
}

export function rgba(rgb: { r: number; g: number; b: number; a: number} | undefined) {
    if (rgb && typeof rgb !== 'undefined' && rgb.a >= 0) {
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    }
    return null;
}

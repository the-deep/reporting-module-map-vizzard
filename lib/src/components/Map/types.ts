import type { Props as HeatmapLayerProps } from './Layers/HeatmapLayer';
import type { Props as MapboxLayerProps } from './Layers/MapboxLayer';
import type { Props as TileLayerProps } from './Layers/TileLayer';
import type { Props as LineLayerProps } from './Layers/LineLayer';
import type { Props as SymbolLayerProps } from './Layers/SymbolLayer';

export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

/*
type HeatMapLayerProperty = GeoJSON.GeoJsonProperties & {
    lon: number;
    lat: number;
    // FIXME: This is not used consistently
    exclude_from_heatmap?: boolean;
}
*/

// NOTE: We don't have an example so this is a guesstimate
/*
interface HexBinLayer {
    id: number;
    type: 'hexbin';
    visible: number;
    data: HeatMapLayerProperty[] | GeoJSON.Point | GeoJSON.MultiPoint;
    zIndex: number;
    opacity: number;
    radius: number;
    fillPalette: 'YlOrRd'; // FIXME: enum is not complete
    weighted: boolean;
    showInLegend: boolean;
    legendSeriesTitle: string;
    style: {
        fillScaleType: 'continuous' | 'categorised' | 'steps';
        fillPow: number;
        fillScaleInvert?: boolean;
    };
}

interface ShadedMaskLayer {
    blur: number;
    id: number;
    mask: string;
    name: string;
    opacity: number;
    smoothing: number;
    type: 'mask';
    visible: number;
    zIndex: number;
    style: {
        fill: Rgba;
        radius: number;
        stroke: Rgba;
        strokeWidth: number;
    };
}

export interface OsmBackgroundLayer {
    id: number;
    name: string;
    opacity: number;
    type: 'osm';
    visible: number;
    zIndex: number;
}
*/

/*
export interface MapboxLayer {
    accessToken: string; // FIXME: Not sure if we need to pass this
    id: number;
    name: string;
    opacity: number;
    style: string;
    type: 'mapbox';
    visible: number;
    zIndex: number;
}
*/

export interface LineLayer {
    id: number;
    labelColumn: string; // FIXME: this has not been used on examples
    legendSeriesTitle: string;
    name: string;
    opacity: number;
    showInLegend: boolean;
    showLabels: boolean;
    type: 'line';
    visible: number;
    zIndex: number;
    style: {
        dashSpacing: number;
        stroke: Rgba;
        strokeType: 'dash' | 'solid'; // FIXME: enum is not complete
        strokeWidth: number;
    };
    data: unknown;
}

/*
export interface HeatMapLayer {
    // NOTE: not used in map. let's check if this is used elsewhere
    // we can remove these if they are not used.
    id: number;
    legendSeriesTitle: string;
    name: string;
    scaleColumn: string;
    scaleDataMin: number;
    scale: number;
    scaleScaling: 'flannery'; // FIXME: enum is not complete
    scaleType: 'fixed'; // FIXME: enum is not complete
    showInLegend: boolean;
    type: 'heatmap';
    visible: number;
    style: {
        fill: Rgba;
        fillPow: number;
        fillScaleType: 'continuous' | 'categorised' | 'steps';
        fillScaleInvert: boolean;
        stroke: Rgba;
        strokeWidth: number;
        labelStyle: {
            color: Rgba;
            fontFamily: string;
            fontSize: number;
            fontWeight: 'normal'; // FIXME: enum is not complete
            showHalo: boolean;
        };
    };
}
*/

/*
interface SymbolLayer {
    enableTooltips: boolean;
    id: number;
    labelColumn?: 'string'; // NOTE: this is most probably a key
    labelStyle: string // FIXME: this must be a mistake
    legendSeriesTitle: string;
    name: string;
    opacity: number;
    scaleColumn: string; // NOTE: this is most probably a key
    scaleDataMax: number;
    scaleDataMin: number;
    scale: number;
    scaleScaling: 'flannery'; // FIXME: add other types
    scaleType: 'fixed' | 'proprtional'; // FIXME: add other types
    showInLegend: boolean;
    showLabels: boolean;
    symbol: 'capital' | 'city' | 'borderCrossing' | 'circle'
    tooltipsTitleColumn: string;
    tooltipsValueColumn: string;
    tooltipsValueLabel: string;
    ts?: number; // FIXME: not sure if this is used
    type: 'symbol';
    visible: number;
    zIndex: number;
    style: {
        fill: Rgba;
        stroke: Rgba;
        strokeWidth: number;
        labelStyle: {
            color: Rgba;
            fontFamily: string;
            fontSize: number;
            fontWeight: 'bold' | 'normal'; // FIXME: add other types
            showHalo: boolean;
            textAlign: 'center'; // FIXME: add other types
            transform: 'uppercase'; // FIXME: add other types
        };
    };
    data: unknown; // geojson or csv
}
interface PolygonLayer {
    id: number;
    labelColumn?: string;
    legendSeriesTitle: string;
    name: string;
    opacity: number;
    showInLegend: boolean;
    showLabels: false;
    ts: number
    type: 'polygon';
    visible: number;
    zIndex: number;
    style: {
        fillColumn?: unknown;
        fillDataMax: number;
        fillDataMin: number;
        fillPalette: 'Blues' | 'OrRd' | 'PuBu'; // FIXME: enum is not complete
        fillPaletteCategorised: 'Pastel1'; // FIXME: enum is not complete
        fillPatternAngle: number;
        fillPatternSize: number;
        fillPatternSpacing: number;
        fillPow: number;
        fill: Rgba;
        fillScaleInvert?: boolean;
        fillScaleType: 'continuous' | 'categorised' | 'steps'; // FIXME: add other types
        fillSingleType: 'solid' | 'pattern'; // FIXME: add other types
        fillSteps: number;
        fillType: 'single' | 'graduated'; // FIXME: add other types
        stroke: Rgba;
        strokeWidth: number;
        labelStyle: {
            color: Rgba;
            fontFamily: string;
            fontSize: number;
            fontWeight: 'bold'; // FIXME: add other types
            showHalo: boolean;
            transform: 'uppercase'; // FIXME; enum is not complete
        }
    },
    data: unknown; // geojson
}
*/

interface CommonLayerOptions {
    id: string;
    visible: boolean;
}

export type Layer = CommonLayerOptions & ({
    type: 'mapbox';
    options: MapboxLayerProps;
} | {
    type: 'heatmap';
    options: HeatmapLayerProps;
} | {
    type: 'osm';
    options: TileLayerProps;
} | {
    type: 'symbol';
    options: SymbolLayerProps;
} | {
  type: 'line';
  options: LineLayerProps;
})

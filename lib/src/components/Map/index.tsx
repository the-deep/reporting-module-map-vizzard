import React, {
    useId,
    useState,
    useEffect,
    useMemo,
} from 'react';
// FIXME: we should remove this
import WebFont from 'webfontloader';
import { Map as MapFromLib } from 'ol';
import { fromLonLat, get } from 'ol/proj';
import { max as d3max } from 'd3';
import GeoJSON from 'ol/format/GeoJSON';
import { toPng } from 'html-to-image';
// FIXME: Add declarations
import { saveAs } from 'file-saver';
// FIXME: Add declarations
import { breaks } from 'statsbreaks';

// FIXME: we should remove this
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';

import './ol.css';
import styles from './styles.module.css';
import {
    osm,
    vector,
    mask,
    numberFormatter,
    rgba,
} from './helpers';
import TileLayer from './Layers/TileLayer';
import VectorLayer from './Layers/VectorLayer';
import LineLayer from './Layers/LineLayer';
import MapboxLayer from './Layers/MapboxLayer';
import MaskLayer from './Layers/MaskLayer';
import SymbolLayer from './Layers/SymbolLayer';
import HeatmapLayer from './Layers/HeatmapLayer';
import HexbinLayer from './Layers/HexbinLayer';
import OlMap from './OlMap';
import ColorScale from '../ColorScale';

// FIXME: may need to update rollup configuration to include files
import cdcf from './assets/logos/cdcf.jpg';
import drc from './assets/logos/drc.jpg';
import dfs from './assets/logos/dfs.svg';
import immap from './assets/logos/immap.png';
import unocha from './assets/logos/unocha.png';
import deep from './assets/logos/deep.svg';
import deepSmall from './assets/logos/deep_small.png';
import capital from './assets/map-icons/capital.svg';
import city from './assets/map-icons/city.svg';
import settlement from './assets/map-icons/settlement.svg';
import marker from './assets/map-icons/marker.svg';
import airport from './assets/map-icons/airport.svg';
import borderCrossing from './assets/map-icons/borderCrossing.svg';
import borderCrossingActive from './assets/map-icons/borderCrossingActive.svg';
import borderCrossingPotential from './assets/map-icons/borderCrossingPotential.svg';
import triangle from './assets/map-icons/triangle.svg';
import idpRefugeeCamp from './assets/map-icons/idp-refugee-camp.svg';

function printPNG(element: HTMLElement) {
    const scale = 2;
    toPng(element, {
        quality: 1,
        // preferredFontFormat: 'embedded-opentype',
        cacheBust: false,
        height: ((element.clientHeight * scale) + 1),
        width: (element.clientWidth * scale),
        style: { transform: `scale(${scale})`, transformOrigin: 'top left' },
    })
        .then((dataUrl) => {
            saveAs(dataUrl, 'export-map.png');
        });
}

function bucketsFn(
    rangeLow: number,
    rangeHigh: number,
    wanted: number,
) {
    const increment = Math.floor((rangeHigh - rangeLow) / (wanted - 1));
    const r = [rangeLow];
    for (let i = 1; i < wanted - 1; i += 1) {
        r.push(i * increment + rangeLow);
    }
    r.push(rangeHigh);
    return r;
}

export type HeatMapLayerProperty = GeoJSON.GeoJsonProperties & {
    lon: number;
    lat: number;
    // FIXME: This is not used consistently
    exclude_from_heatmap?: boolean;
}

interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

// NOTE: We don't have an example so this is a guesstimate
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
        fillScaleType: 'continuous' | 'categorised' | 'steps'; // FIXME: not sure if all of these are supported
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
interface OsmBackgroundLayer {
    id: number;
    name: string;
    opacity: number;
    type: 'osm';
    visible: number;
    zIndex: number;
}
interface MapboxLayer {
    accessToken: string; // FIXME: Not sure if we need to pass this
    id: number;
    name: string;
    opacity: number;
    style: string;
    type: 'mapbox';
    visible: number;
    zIndex: number;
}

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

export interface HeatMapLayer {
    // used in map
    data: HeatMapLayerProperty[] | GeoJSON.FeatureCollection<GeoJSON.Point>;
    zIndex: number;
    opacity: number;
    blur: number;
    radius: number;
    fillPalette: 'YlOrRd'; // FIXME: enum is not complete
    weighted: boolean;
    scaleDataMax: number;

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
        fillScaleType: 'continuous' | 'categorised' | 'steps'; // FIXME: not sure if all of these are supported
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

type Layer = ShadedMaskLayer
    | OsmBackgroundLayer
    | MapboxLayer
    | SymbolLayer
    | PolygonLayer
    | LineLayer
    | HeatMapLayer
    | HexBinLayer;

interface Props {
    // NOTE: Not sure if mapObj and setMapObj is required
    mapObj: MapFromLib;
    setMapObj: (map: MapFromLib) => void;
    layers: Layer[];

    center: { lon: number; lat: number };
    dashboard?: boolean; // FIXME: not sure if this is used
    dateText?: string; // FIXME: What is this?
    embed?: boolean;
    enableDoubleClickZoom?: boolean,
    enableDragPan?: boolean,
    enableMouseWheelZoom?: boolean,
    enableZoomControls?: boolean,
    headerStyle: 'iMMAP' | undefined; // FIXME: we need to remove this
    height?: number;
    legendPosition?: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft';
    legendTopPadding?: number;
    mainTitle?: string;
    maxZoom: number;
    minZoom: number;
    overviewMapPosition?: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft';
    paddingBottom?: number;
    primaryColor?: Rgba;
    print?: boolean;
    scaleBar?: boolean;
    scaleBarPosition: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft';
    scaleUnits?: 'degrees' | 'imperial' | 'nautical' | 'metric' | 'us';
    showFooter?: boolean;
    showHeader?: boolean;
    showLegend?: boolean;
    showLogos?: string[];
    showOverview?: boolean;
    showScale?: boolean;
    sources?: string;
    subTitle?: string;
    width?: number;
    zoomControlsPosition: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft', // FIXME: check if topLeft works
    zoom?: number;
    fontStyle: {
        color: Rgba;
        fontFamily: string;
        fontWeight: 'normal'; // FIXME: other options
    };
}

function Map(props: Props) {
    const {
        mapObj,
        setMapObj,

        layers,
        height = 400,
        width = 700,
        fontStyle,
        zoom = 5,
        minZoom,
        maxZoom,
        center = { lon: 30.21, lat: 15.86 },
        showHeader,
        showOverview = false,
        overviewMapPosition = 'bottomRight',
        // FIXME: headerStyle for iMMap does not make sense
        headerStyle = 'default',
        mainTitle = 'Main title',
        subTitle = 'Sub-title',
        dateText = 'dateText',
        primaryColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
        },
        showScale,
        scaleUnits,
        scaleBar,
        scaleBarPosition,
        enableMouseWheelZoom,
        enableDragPan,
        enableDoubleClickZoom,
        enableZoomControls,
        zoomControlsPosition,
        showLegend,
        legendPosition,
        showFooter,
        sources,
        showLogos,
        dashboard = false,
        print = false,
        embed = false,
        legendTopPadding = 0,
        paddingBottom = 0,
    } = props;

    const [map, setMap] = useState<MapFromLib | undefined>(undefined);
    const [fonts, setFonts] = useState<string[]>([]);
    const printPNGId = useId();
    const mapId = useId();

    let sourcesPadding = {};

    if (paddingBottom > 0) {
        sourcesPadding = { position: 'relative', bottom: (paddingBottom + 22) };
    }
    const theme = createTheme({
        palette: {
            primary: grey,
        },
    });

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
    };

    useEffect(
        () => {
            if (fonts) {
                WebFont.load({
                    google: {
                        families: fonts,
                    },
                });
            }
        },
        [fonts, mapId],
    );

    useEffect(
        () => {
            if (!map) {
                return undefined;
            }
            // FIXME: Do not use id here
            const mapElement = document.getElementById(mapId) ?? undefined;
            if (!mapElement || embed) {
                return undefined;
            }

            const buttonElement = document.getElementById(printPNGId);
            if (!buttonElement) {
                return undefined;
            }
            const printPNGHandler = () => {
                printPNG(mapElement);
            };

            buttonElement.addEventListener('click', printPNGHandler);
            return () => {
                buttonElement.removeEventListener('click', printPNGHandler);
            };
        },
        [map],
    );

    useEffect(
        () => {
            const usedFonts: string[] = [];
            layers.forEach((layer) => {
                if (layer.type !== 'polygon' && layer.type !== 'symbol' && layer.type !== 'heatmap') {
                    return;
                }
                const fontFamily = layer?.style?.labelStyle?.fontFamily;
                if (!fontFamily) {
                    return;
                }
                if (!usedFonts.includes(fontFamily)) {
                    usedFonts.push(fontFamily);
                }
            });

            if (!usedFonts.includes(fontStyle.fontFamily)) {
                usedFonts.push(fontStyle.fontFamily);
            }
            setFonts(usedFonts);
        },
        [layers, fontStyle.fontFamily],
    );

    // FIXME: no need to memoize this
    const renderLayers = useMemo(
        () => {
            const renderLayersArr = layers.map((layer) => {
                if (layer.type === 'symbol' && layer.visible > 0) {
                    return (
                        <SymbolLayer
                            map={map}
                            key={`symbolLayer${layer.id}`}
                            layerId={`symbolLayer${layer.id}`}
                            source={layer.data}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            style={layer.style}
                            primaryColor={rgba(primaryColor)}
                            symbol={layer.symbol}
                            scale={layer.scale}
                            data={layer.data}
                            showLabels={layer.showLabels}
                            labelStyle={layer.labelStyle}
                            scaleType={layer.scaleType}
                            scaleScaling={layer.scaleScaling}
                            scaleColumn={layer.scaleColumn}
                            scaleDataMin={layer.scaleDataMin}
                            scaleDataMax={layer.scaleDataMax}
                            labelColumn={layer.labelColumn}
                            enableTooltips={layer.enableTooltips}
                            tooltipsTitleColumn={layer.tooltipsTitleColumn}
                            tooltipsValueColumn={layer.tooltipsValueColumn}
                            tooltipsValueLabel={layer.tooltipsValueLabel}
                        />
                    );
                }
                if (layer.type === 'heatmap' && layer.visible > 0) {
                    return (
                        <HeatmapLayer
                            key={`symbolLayer${layer.id}`}
                            map={map}
                            data={layer.data}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            blur={layer.blur}
                            radius={layer.radius}
                            fillPalette={layer.fillPalette}
                            weighted={layer.weighted}
                            scaleDataMax={layer.scaleDataMax}
                        />
                    );
                }
                if (layer.type === 'hexbin' && layer.visible > 0) {
                    return (
                        <HexbinLayer
                            map={map}
                            key={`symbolLayer${layer.id}`}
                            // source={layer.data}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            // style={layer.style}
                            // scale={layer.scale}
                            data={layer.data}
                            // scaleColumn={layer.scaleColumn}
                            // scaleDataMin={layer.scaleDataMin}
                            // scaleDataMax={layer.scaleDataMax}
                            // blur={layer.blur}
                            radius={layer.radius}
                            fillPalette={layer.fillPalette}
                            weighted={layer.weighted}
                        />
                    );
                }
                if (layer.type === 'osm' && layer.visible > 0) {
                    return (
                        <TileLayer
                            map={map}
                            key={`tileLayer${layer.id}`}
                            source={osm()}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                        />
                    );
                }
                if (layer.type === 'polygon' && layer.visible > 0) {
                    return (
                        <VectorLayer
                            map={map}
                            key={`vectorLayer${layer.id}`}
                            source={vector({
                                features: new GeoJSON().readFeatures(layer.data, {
                                    featureProjection: get('EPSG:3857') ?? undefined,
                                }),
                            })}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            style={layer.style}
                            showLabels={layer.showLabels}
                            labelColumn={layer.labelColumn}
                            declutter
                        />
                    );
                }
                if ((layer.type === 'line') && (layer.visible > 0)) {
                    return (
                        <LineLayer
                            map={map}
                            key={`lineLayer${layer.id}`}
                            source={vector({
                                features: new GeoJSON().readFeatures(layer.data, {
                                    featureProjection: get('EPSG:3857') ?? undefined,
                                }),
                            })}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            style={layer.style}
                        />
                    );
                }
                if ((layer.type === 'mapbox') && (layer.visible > 0)) {
                    return (
                        <MapboxLayer
                            map={map}
                            key={`mapboxLayer${layer.id}`}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            styleUrl={layer.style}
                            accessToken={layer.accessToken}
                        />
                    );
                }
                if ((layer.type === 'mask') && (layer.visible > 0)) {
                    return (
                        <MaskLayer
                            map={map}
                            key={`maskLayer${layer.id}`}
                            id={layer.id}
                            source={mask()}
                            polygon={layer.mask}
                            zIndex={layer.zIndex}
                            opacity={layer.opacity}
                            blur={layer.blur}
                            smoothing={layer.smoothing}
                        />
                    );
                }
                return undefined;
            });
            return renderLayersArr;
        },
        [map, JSON.stringify(layers)],
    );

    const legendRows = useMemo(
        () => {
            const legendArr: React.ReactNode[] = [];

            layers.forEach((layer) => {
                if (layer.type === 'symbol') {
                    if (layer.symbol === 'circle') {
                        if (layer.scaleType === 'fixed') {
                            let r = 6 * layer.scale;
                            if (layer.scale > 1) {
                                r = 6;
                            }
                            const row = layer.visible > 0 && layer.showInLegend && (
                                <div key={`legendSymbol${layer.id}`}>
                                    <div className={styles.legendSymbol}>
                                        <div className="legendCircles">
                                            <svg
                                                width="40"
                                                height="20"
                                            >
                                                <circle
                                                    cx="7.5"
                                                    cy="7"
                                                    r={r}
                                                    style={{
                                                        fill: rgba(layer.style.fill) ?? undefined,
                                                        strokeWidth: layer.style.strokeWidth,
                                                        // eslint-disable-next-line max-len
                                                        stroke: rgba(layer.style.stroke) ?? undefined,
                                                        opacity: layer.opacity,
                                                    }}
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        className={styles.legendSeriesTitle}
                                        style={{ verticalAlign: 'top' }}
                                    >
                                        {layer.legendSeriesTitle}
                                    </div>
                                </div>
                            );
                            legendArr.push(row);
                        } else { // proportional symbol legend
                            const bv = bucketsFn(0, layer.scaleDataMax, 20);
                            const numBuckets = 6;
                            const buckets = breaks(bv, {
                                method: 'pretty',
                                nb: numBuckets,
                                minmax: false,
                                precision: 0,
                            });
                            let exp = 0.5;
                            if (layer.scaleScaling === 'flannery') {
                                exp = 0.5716;
                            }
                            const maxRadius = (
                                ((d3max(buckets) / layer.scaleDataMax) / 3.14) ** exp
                                * (10 * layer.scale)
                            );
                            if ((layer.scale < 3)) {
                                buckets.splice(1, 1);
                                if (buckets.length > 2) {
                                    buckets.splice(1, 1);
                                }
                            }

                            if (buckets.length > 3) {
                                buckets.splice(2, 1);
                            }

                            const legendRowHeight = (maxRadius * 2) + 5;

                            const circles = buckets.map((bucket) => {
                                const radius = (
                                    ((bucket / layer.scaleDataMax) / 3.14) ** exp
                                    * (10 * layer.scale)
                                );

                                return (
                                    <g key={`legendSymbolCircle${bucket}`}>
                                        <circle
                                            cx={(maxRadius) + 2}
                                            cy={radius + 3}
                                            r={radius}
                                            clipPath="url(#cut-off)"
                                            style={{
                                                fill: rgba(layer.style.fill) ?? undefined,
                                                strokeWidth: layer.style.strokeWidth,
                                                stroke: rgba(layer.style.stroke) ?? undefined,
                                                opacity: layer.opacity,
                                            }}
                                        />
                                        <text
                                            x={(maxRadius) + 11}
                                            y={radius + (radius) + 5}
                                            // FIXME: changed textAnchor from  'left' to 'start'
                                            style={{
                                                textAnchor: 'start',
                                                fontSize: 7,
                                                fill: 'rgb(49 49 49)',
                                            }}
                                        >
                                            {numberFormatter(bucket)}
                                        </text>
                                        <line
                                            x1={(maxRadius)}
                                            x2={(maxRadius) + 10}
                                            y1={radius * 2 + 3}
                                            y2={radius * 2 + 3}
                                            stroke="grey"
                                            strokeWidth={0.4}
                                            strokeDasharray="1,1"
                                        />
                                    </g>
                                );
                            });
                            // FIXME: set type for filterStyle
                            let filterStyle = {};
                            if (layer.legendSeriesTitle === 'Sudanese refugees and IDPs') {
                                filterStyle = { filter: 'saturate(0%)' };
                            }
                            const row = layer.visible > 0 && layer.showInLegend && (
                                <div key={`legendSymbol${layer.id}`}>
                                    <div className={styles.legendSeriesTitle}>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {layer.legendSeriesTitle}
                                        </span>
                                    </div>
                                    <div
                                        className={styles.legendSymbolProportional}
                                        style={filterStyle}
                                    >
                                        <div
                                            // FIXME: remove usage of id
                                            id="legendCircles"
                                            className={styles.legendCircles}
                                        >
                                            <svg
                                                width="120"
                                                height={legendRowHeight + 3}
                                            >
                                                <clipPath id="cut-off">
                                                    <rect
                                                        x="0"
                                                        y="0"
                                                        width={legendRowHeight / 2}
                                                        height={legendRowHeight}
                                                    />
                                                </clipPath>
                                                {circles}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            );
                            legendArr.push(row);
                        }
                    } else {
                        let scaleTransform = layer.scale;
                        if (layer.scale > 0.85) {
                            scaleTransform = 0.85;
                        }
                        const row = layer.visible > 0 && layer.showInLegend && (
                            <div key={`legendSymbol${layer.id}`}>
                                <div className={styles.legendSymbol}>
                                    <img
                                        src={symbolIcons[layer.symbol]}
                                        alt={layer.symbol}
                                        style={{
                                            transform: `scale(${scaleTransform})`,
                                            opacity: layer.opacity,
                                        }}
                                    />
                                </div>
                                <div className={styles.legendSeriesTitle}>
                                    {layer.legendSeriesTitle}
                                </div>
                            </div>
                        );
                        legendArr.push(row);
                    }
                }
                if (layer.type === 'polygon') {
                    let legendPolygonRow: React.ReactNode;
                    if (layer.style.fillType === 'single') {
                        if (layer.style.fillSingleType === 'solid') {
                            legendPolygonRow = (
                                <div
                                    className={styles.legendPolygonSingle}
                                    style={{
                                        backgroundColor: rgba(layer.style.fill) ?? undefined,
                                        borderWidth: layer.style.strokeWidth,
                                        borderColor: rgba(layer.style.stroke) ?? undefined,
                                    }}
                                />
                            );
                        }
                        if (layer.style.fillSingleType === 'pattern') {
                            legendPolygonRow = (
                                <div
                                    className={styles.legendPolygonSingle}
                                    style={{
                                        background: `repeating-linear-gradient(${90 + layer.style.fillPatternAngle}deg, transparent, transparent ${layer.style.fillPatternSpacing / 1.5}px, ${rgba(layer.style.fill)} ${layer.style.fillPatternSpacing / 1.5}px, ${rgba(layer.style.fill)} ${(layer.style.fillPatternSize + layer.style.fillPatternSpacing / 1.5)}px)`,
                                        borderWidth: layer.style.strokeWidth,
                                        borderColor: rgba(layer.style.stroke) ?? undefined,
                                    }}
                                />
                            );
                        }
                        const row = layer.visible > 0 && layer.showInLegend && (
                            <div key={`legendSymbol${layer.id}`}>
                                <div
                                    style={{
                                        opacity: layer.opacity,
                                        display: 'inline',
                                    }}
                                >
                                    {legendPolygonRow}
                                </div>
                                <div className={styles.legendSeriesTitle}>
                                    {layer.legendSeriesTitle}
                                </div>
                            </div>
                        );
                        legendArr.push(row);
                    }
                    if (layer.style.fillType === 'graduated') {
                        legendPolygonRow = (
                            <div>
                                <div
                                    className={styles.legendPolygonGraduated}
                                    style={{ opacity: layer.opacity }}
                                >
                                    <ColorScale
                                        // FIXME: Need to use discriminated unions for polygon
                                        colorScaleType={layer.style.fillScaleType}
                                        colorScale={layer.style.fillPalette}
                                        steps={layer.style.fillSteps}
                                        pow={layer.style.fillPow}
                                        containerClass="colorScaleDiv"
                                        inverted={layer.style.fillScaleInvert}
                                    />
                                </div>
                                <div className={styles.legendPolygonScaleUnits}>
                                    <div className={styles.legendPolygonScaleUnit1}>
                                        {layer.style.fillDataMin}
                                    </div>
                                    <div className={styles.legendPolygonScaleUnit2}>
                                        {numberFormatter(layer.style.fillDataMax)}
                                    </div>
                                </div>
                            </div>

                        );
                        const row = layer.visible > 0 && layer.showInLegend && (
                            <div key={`legendPolygon${layer.id}`}>
                                <div className={styles.legendSeriesTitle}>
                                    <b style={{ fontSize: 10 }}>
                                        {layer.legendSeriesTitle}
                                    </b>
                                </div>
                                {legendPolygonRow}
                            </div>
                        );
                        legendArr.push(row);
                    }
                }
                if (layer.type === 'heatmap') {
                    const legendHeatmapRow = (
                        <div>
                            <div
                                className={styles.legendPolygonGraduated}
                                style={{ opacity: layer.opacity, height: 10 }}
                            >
                                <ColorScale
                                    // FIXME: Need to use discriminated unions for polygon
                                    colorScale={layer.fillPalette}
                                    steps={5}
                                    colorScaleType={layer.style.fillScaleType}
                                    pow={layer.style.fillPow}
                                    containerClass="colorScaleDiv"
                                    inverted={layer.style.fillScaleInvert}
                                />
                            </div>
                        </div>
                    );
                    const row = layer.visible > 0 && layer.showInLegend && (
                        <div key={`legendPolygon${layer.id}`}>
                            <div className={styles.legendSeriesTitle}>
                                <b style={{ fontSize: 10 }}>{layer.legendSeriesTitle}</b>
                            </div>
                            {legendHeatmapRow}
                        </div>
                    );
                    legendArr.push(row);
                }
                if (layer.type === 'hexbin') {
                    const legendHexbinRow = (
                        <div>
                            <div
                                className={styles.legendPolygonGraduated}
                                style={{ opacity: layer.opacity, height: 10 }}
                            >
                                <ColorScale
                                    // FIXME: Need to use discriminated unions for polygon
                                    colorScale={layer.fillPalette}
                                    steps={5}
                                    colorScaleType={layer.style.fillScaleType}
                                    pow={layer.style.fillPow}
                                    containerClass="colorScaleDiv"
                                    inverted={layer.style.fillScaleInvert}
                                />
                            </div>
                        </div>
                    );
                    const row = layer.visible > 0 && layer.showInLegend && (
                        <div key={`legendPolygon${layer.id}`}>
                            <div className={styles.legendSeriesTitle}>
                                <b style={{ fontSize: 10 }}>
                                    {layer.legendSeriesTitle}
                                </b>
                            </div>
                            {legendHexbinRow}
                        </div>
                    );
                    legendArr.push(row);
                }
            });
            const legendArrFiltered = legendArr.filter(Boolean);
            return legendArrFiltered;
        },
        [JSON.stringify(layers)],
    );

    const bottomPos = useMemo(
        () => {
            let bottom = 10;
            if (legendPosition === 'bottomLeft') {
                bottom = 30;
                return { bottom: 30, left: 4 };
            }
            if (legendPosition === 'topLeft') {
                if (showHeader === true) {
                    return { top: 60, left: 4 };
                }
                return { top: 10, left: 4 };
            }
            if (legendPosition === 'topRight') {
                if ((enableZoomControls === true) && (zoomControlsPosition === 'topRight')) {
                    return { top: 60, right: 10 };
                }
                return { top: 10, right: 10 };
            }
            if (legendPosition === 'bottomRight') {
                if ((showScale === true) && (scaleBarPosition === 'bottomRight')) {
                    return { bottom: 35, right: 10 };
                }
                return { bottom: 10, right: 10 };
            }
            return { bottom, left: 10 };
        },
        [
            showHeader,
            enableZoomControls,
            zoomControlsPosition,
            showScale,
            scaleBarPosition,
            showFooter,
            showLegend,
            legendPosition,
            showScale,
            showOverview,
        ],
    );

    let w = `${width}px`;
    if (embed) {
        w = '100%';
    }
    let dashboardStyle = {};
    let sourcesStyle = {};
    const yOffset = 97 + paddingBottom;

    let h = String(height);
    // FIXME: Removed comparision height === ''
    if (height === 0) {
        h = `calc(100vh - ${yOffset}px)`;
    }
    let paddingTop = 0;
    if (dashboard) {
        paddingTop = 100;
    }
    if (dashboard) {
        dashboardStyle = {
            position: 'absolute',
            top: 0,
            width: '100%',
        };
    }
    if (dashboard) {
        sourcesStyle = {
            textAlign: 'right',
            right: 10,
            bottom: 72,
            zIndex: 99999,
        };
    }
    if (dashboard && print) {
        sourcesStyle = {
            textAlign: 'left',
            right: 10,
            bottom: 72,
            zIndex: 99999,
        };
    }
    const mapContext = (
        <div>
            <div>
                <div
                    // FIXME: Do not use id here
                    id={mapId}
                    // FIXME: Use _cs here
                    className={`${styles.mapContainer} ${(embed ? styles.embedMap : '')} ${(headerStyle === 'iMMAP' ? styles.headeriMMAP : '')}`}
                    style={{
                        ...dashboardStyle,
                        minHeight: height,
                        width: w,
                        fontFamily: fontStyle.fontFamily,
                    }}
                >
                    {showHeader && (
                        <div className={styles.header}>
                            <div
                                className={styles.mapTitle}
                                style={(headerStyle === 'iMMAP' ? { backgroundColor: '#FFF' } : {})}
                            >
                                {showLogos && (
                                    <div
                                        className={styles.logos}
                                        style={(enableZoomControls && zoomControlsPosition === 'topRight' && headerStyle !== 'iMMAP') ? { marginRight: 0, marginTop: 6 } : {}}
                                    >
                                        {showLogos.map((logo) => (
                                            <div
                                                key={logo}
                                                className={styles.headerLogo}
                                            >
                                                {logo === 'CDCF' && (
                                                    <img
                                                        className={styles.logoCDCF}
                                                        src={cdcf}
                                                        alt=""
                                                    />
                                                )}
                                                {logo === 'Data Friendly Space' && (
                                                    <img
                                                        className={styles.logoDfs}
                                                        src={dfs}
                                                        alt=""
                                                    />
                                                )}
                                                {logo === 'DEEP' && (
                                                    <img
                                                        className={styles.logoDeep}
                                                        src={deep}
                                                        alt=""
                                                    />
                                                )}
                                                {logo === 'DEEP (small)' && (
                                                    <img
                                                        className={styles.logoDeepSmall}
                                                        src={deepSmall}
                                                        alt=""
                                                    />
                                                )}
                                                {logo === 'DRC' && (
                                                    <img
                                                        className={styles.logoDrc}
                                                        src={drc}
                                                        alt=""
                                                    />
                                                )}
                                                {logo === 'iMMAP' && (
                                                    <div>
                                                        <img
                                                            className={styles.logoImmap}
                                                            src={immap}
                                                            alt=""
                                                        />
                                                        {showLogos.length > 1 && (
                                                            <div className={styles.logoImmapBorder}>
                                                                &nbsp;
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {logo === 'UNOCHA' && (
                                                    <img
                                                        className={styles.logoUnocha}
                                                        src={unocha}
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className={styles.titleContainer}>
                                    <div
                                        className={styles.mainTitle}
                                        style={{
                                            color: rgba(primaryColor) ?? undefined,
                                        }}
                                    >
                                        {mainTitle}
                                    </div>
                                    <div className={styles.subTitle}>
                                        {subTitle}
                                    </div>
                                </div>
                                <div
                                    className={styles.dateText}
                                    style={(enableZoomControls && zoomControlsPosition === 'topRight') ? { marginRight: 34 } : {}}
                                >
                                    {dateText}
                                </div>
                            </div>
                            {headerStyle === 'iMMAP' && (
                                <div className={styles.immapHeaderBar}>
                                    <div className={styles.immapHeaderBar1} />
                                    <div className={styles.immapHeaderBar2} />
                                </div>
                            )}
                        </div>
                    )}
                    <div
                        className={dashboard ? styles.dashboard : ''}
                        style={{
                            height: h,
                            position: 'relative',
                            paddingTop,
                            marginBottom: paddingBottom,
                        }}
                    >
                        <OlMap
                            // FIXME: we might need to remove map or mapObject or both
                            map={map}
                            setMap={setMap}
                            // mapObj={mapObj}
                            setMapObj={setMapObj}
                            center={fromLonLat([center.lon, center.lat])}
                            zoom={zoom}
                            minZoom={minZoom}
                            maxZoom={maxZoom}
                            showScale={showScale}
                            scaleUnits={scaleUnits}
                            scaleBar={scaleBar}
                            scaleBarPosition={scaleBarPosition}
                            enableDragPan={enableDragPan}
                            enableMouseWheelZoom={enableMouseWheelZoom}
                            enableDoubleClickZoom={enableDoubleClickZoom}
                            enableZoomControls={enableZoomControls}
                            zoomControlsPosition={zoomControlsPosition}
                            showOverview={showOverview}
                            overviewMapPosition={overviewMapPosition}
                            paddingBottom={paddingBottom}
                        >
                            {renderLayers}
                        </OlMap>
                        {showLegend && (
                            <div
                                className={styles.mapLegend}
                                style={{
                                    ...bottomPos,
                                    top: legendTopPadding,
                                }}
                            >
                                <div className={styles.mapLegendTitle}>
                                    Legend
                                </div>
                                <div className={styles.legendRow}>
                                    {legendRows}
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        style={{
                            ...sourcesPadding,
                            ...sourcesStyle,
                        }}
                        className={styles.mapFooter}
                    >
                        <b>Sources</b>
                        <div className={styles.sources}>
                            &nbsp;
                            {sources}
                        </div>
                    </div>
                    {(headerStyle === 'iMMAP' && showFooter) && (
                        <div className={styles.immapFooterBar}>
                            <div className={styles.immapFooterColorBar}>
                                <div className={styles.immapFooterBar1} />
                                <div className={styles.immapFooterBar2} />
                            </div>
                            <div className={styles.immapStrapline}>
                                Better Data | Better Decisions |&nbsp;
                                <div className={styles.immapStrapLine2}>
                                    Better Outcomes
                                </div>
                            </div>
                            <div className={styles.disclaimer}>
                                The boundaries, names, and designations used in this map
                                do not imply official endorsement or acceptance by iMMAP
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {!embed && (
                <div className={styles.exportButtons}>
                    <Button
                        id={printPNGId}
                        size="small"
                        theme={theme}
                        variant="outlined"
                    >
                        Export to PNG
                    </Button>
                </div>
            )}
        </div>
    );
    // });

    return mapContext;
}

export default Map;

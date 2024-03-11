import React, {
    useState,
    useMemo,
} from 'react';

import { Map as MapFromLib } from 'ol';
import { fromLonLat } from 'ol/proj';

import './ol.css';

import TileLayer from './Layers/TileLayer';
import MapboxLayer from './Layers/MapboxLayer';
import HeatmapLayer from './Layers/HeatmapLayer';
import SymbolLayer from './Layers/SymbolLayer';
import LineLayer from './Layers/LineLayer';

import OlMap from './OlMap';
import styles from './styles.module.css';

import MapContext, { MapContextProps } from './MapContext';

import type { Layer, Rgba } from './types';

function getLayerId(type: string, id: string) {
    return `${type}-${id}`;
}

export interface Props {
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
        layers,
        height = 400,
        fontStyle,
        zoom = 5,
        minZoom,
        maxZoom,
        center = { lon: 30.21, lat: 15.86 },
        showOverview = false,
        overviewMapPosition = 'bottomRight',
        showScale,
        scaleUnits,
        scaleBar,
        scaleBarPosition,
        enableMouseWheelZoom,
        enableDragPan,
        enableDoubleClickZoom,
        enableZoomControls,
        zoomControlsPosition,
        paddingBottom = 0,
    } = props;

    const [map, setMap] = useState<MapFromLib | null>(null);

    const renderLayers = useMemo(
        () => {
            const renderLayersArr = layers.map((layer) => {
                if (layer.type === 'heatmap' && layer.visible) {
                    return (
                        <HeatmapLayer
                            key={getLayerId(layer.type, layer.id)}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...layer.options}
                        />
                    );
                }
                if (layer.type === 'mapbox' && layer.visible) {
                    return (
                        <MapboxLayer
                            key={getLayerId(layer.type, layer.id)}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...layer.options}
                        />
                    );
                }
                if (layer.type === 'osm' && layer.visible) {
                    return (
                        <TileLayer
                            key={getLayerId(layer.type, layer.id)}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...layer.options}
                        />
                    );
                }
                if (layer.type === 'symbol' && layer.visible) {
                    return (
                        <SymbolLayer
                            key={getLayerId(layer.type, layer.id)}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...layer.options}
                        />
                    );
                }
                if (layer.type === 'line' && layer.visible) {
                    return (
                        <LineLayer
                            key={getLayerId(layer.type, layer.id)}
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            {...layer.options}
                        />
                    );
                }
                /*
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
                */

                return undefined;
            });

            return renderLayersArr;
        },
        [layers],
    );

    const mapContextValue = useMemo<MapContextProps>(
        () => ({
            map,
            setMap,
        }),
        [map, setMap],
    );

    return (
        <MapContext.Provider value={mapContextValue}>
            <div
                className={styles.mapContainer}
                style={{
                    minHeight: height,
                    fontFamily: fontStyle.fontFamily,
                }}
            >
                <OlMap
                    center={fromLonLat([center.lon, center.lat]) as [number, number]}
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
            </div>
        </MapContext.Provider>
    );
}

export default Map;

import React, {
    useState,
    useMemo,
} from 'react';
import { isDefined } from '@togglecorp/fujs';
import { Map as MapFromLib } from 'ol';
import { fromLonLat } from 'ol/proj';

import TextNode, { type Props as DefaultTextNodeProps } from '../TextNode';
import TileLayer from './Layers/TileLayer';
import MapboxLayer from './Layers/MapboxLayer';
import HeatmapLayer from './Layers/HeatmapLayer';
import SymbolLayer from './Layers/SymbolLayer';
import LineLayer from './Layers/LineLayer';

import OlMap, { type Props as OlMapProps } from './OlMap';

import MapContext, { MapContextProps } from './MapContext';

import type { Layer } from './types';

type TextNodeProps = Omit<DefaultTextNodeProps, 'as'>;

function getLayerId(type: string, id: string) {
    return `${type}-${id}`;
}

export interface Props extends Omit<OlMapProps, 'center' | 'children'> {
    title?: TextNodeProps;
    subTitle?: TextNodeProps;
    center: [number, number];
    layers: Layer[];
}

// const defaultCenter = [30.21, 15.86] as const;

function Map(props: Props) {
    const {
        title,
        subTitle,
        center,
        layers,
        ...olMapProps
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
            {isDefined(title) && (
                <TextNode
                    as="h2"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...title}
                />
            )}
            {isDefined(subTitle) && (
                <TextNode
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...subTitle}
                />
            )}
            <OlMap
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...olMapProps}
                center={fromLonLat(center)}
            >
                {renderLayers}
            </OlMap>
        </MapContext.Provider>
    );
}

export default Map;

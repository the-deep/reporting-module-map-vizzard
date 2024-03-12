import {
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { isDefined, isNotDefined } from '@togglecorp/fujs';
import OLTileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import * as olSource from 'ol/source';

import MapContext from '../MapContext';

export interface Props {
    opacity: number;
    zIndex: number;
    source?: TileSource;
}

function TileLayer(props: Props) {
    const {
        source: sourceFromProps,
        zIndex = 1,
        opacity = 1,
    } = props;

    const source = useMemo(
        () => {
            if (isDefined(sourceFromProps)) {
                return sourceFromProps;
            }

            return new olSource.OSM();
        },
        [sourceFromProps],
    );

    const { map } = useContext(MapContext);

    const configRef = useRef({
        zIndex,
        opacity,
    });

    const tileLayer = useMemo(
        () => (
            new OLTileLayer({
                source,
                zIndex: configRef.current.zIndex,
                opacity: configRef.current.opacity,
            })
        ),
        [source],
    );

    useEffect(() => {
        const currentMap = map;
        const addedLayer = tileLayer;

        if (isNotDefined(currentMap) || isNotDefined(addedLayer)) {
            return undefined;
        }

        currentMap.addLayer(addedLayer);

        return () => {
            currentMap.removeLayer(addedLayer);
        };
    }, [map, tileLayer]);

    useEffect(() => {
        if (isNotDefined(tileLayer)) {
            return;
        }

        tileLayer.setOpacity(opacity);
        tileLayer.setZIndex(zIndex);
    }, [tileLayer, opacity, zIndex]);

    return null;
}

export default TileLayer;

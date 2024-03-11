import { useEffect, useMemo, useRef } from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { Map as MapFromLib } from 'ol';
import OLTileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';

import { OsmBackgroundLayer } from '../index';

interface Props extends Pick<OsmBackgroundLayer, 'zIndex' | 'opacity'> {
    map: MapFromLib | undefined;
    source: TileSource;
}
function TileLayer(props: Props) {
    const {
        map,
        source,
        zIndex = 1,
        opacity = 1,
    } = props;

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

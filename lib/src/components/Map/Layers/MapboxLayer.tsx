import { useEffect, useRef, useMemo } from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { Map as MapFromLib } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

import { MapboxLayer } from '../index';

interface Props extends Pick<MapboxLayer, 'zIndex' | 'opacity' | 'accessToken'> {
    map: MapFromLib | undefined;
    styleUrl: string;
}

function MapboxLayer(props: Props) {
    const {
        map,
        zIndex = 1,
        opacity = 1,
        styleUrl,
        accessToken,
    } = props;

    const configRef = useRef({
        zIndex,
        opacity,
    });

    const mapboxLayer = useMemo(
        () => {
            let styleUrlParsed = styleUrl.replace('mapbox://', '');
            styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

            return new TileLayer({
                source: new XYZ({
                    url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
                    tileSize: 512,
                    // preload: 10,
                    crossOrigin: 'anonymous',
                }),
                zIndex: configRef.current.zIndex,
                opacity: configRef.current.opacity,
            });
        },
        [styleUrl, accessToken],
    );

    useEffect(() => {
        const currentMap = map;
        const addedLayer = mapboxLayer;

        if (isNotDefined(currentMap) || isNotDefined(addedLayer)) {
            return undefined;
        }

        currentMap.addLayer(addedLayer);

        return () => {
            currentMap.removeLayer(addedLayer);
        };
    }, [map, styleUrl, accessToken, mapboxLayer]);

    useEffect(() => {
        if (!mapboxLayer) return;

        mapboxLayer.setOpacity(opacity);
        mapboxLayer.setZIndex(zIndex);
    }, [mapboxLayer, opacity, zIndex]);

    return null;
}

export default MapboxLayer;

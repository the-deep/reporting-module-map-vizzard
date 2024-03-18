import {
    useEffect,
    useRef,
    useMemo,
    useContext,
} from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

import MapContext from '../MapContext';

export interface Props {
    styleUrl: string;
    accessToken: string;
    opacity: number | undefined;
    zIndex: number;
}

function MapboxLayer(props: Props) {
    const {
        zIndex = 1,
        opacity = 1,
        styleUrl,
        accessToken,
    } = props;

    const { map } = useContext(MapContext);

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

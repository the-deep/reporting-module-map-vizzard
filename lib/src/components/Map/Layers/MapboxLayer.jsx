import { useState, useEffect } from 'react';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';

function MapboxLayer({
    map, zIndex = 1, opacity = 1, styleUrl, accessToken,
}) {
    const [mapboxLayer, setMapboxLayer] = useState(undefined);

    useEffect(() => {
        if (!map) return undefined;

        let styleUrlParsed = styleUrl.replace('mapbox://', '');
        styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

        const layer = new TileLayer({
            source: new XYZ({
                url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
                tileSize: 512,
                preload: 10,
                crossOrigin: 'anonymous',
            }),
        });

        map.addLayer(layer);
        layer.setZIndex(zIndex);
        layer.setOpacity(opacity);

        setMapboxLayer(layer);

        return () => {
            if (map) {
                map.removeLayer(layer);
            }
        };
    }, [map, styleUrl, accessToken]);

    useEffect(() => {
        if (!mapboxLayer) return;
        mapboxLayer.setOpacity(opacity);
    }, [mapboxLayer, opacity]);

    useEffect(() => {
        if (!mapboxLayer) return;
        mapboxLayer.setZIndex(zIndex);
    }, [mapboxLayer, zIndex]);

    return null;
}

export default MapboxLayer;

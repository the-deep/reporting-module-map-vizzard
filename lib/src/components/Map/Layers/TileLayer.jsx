import { useState, useEffect } from 'react';
import OLTileLayer from 'ol/layer/Tile';

function TileLayer({
    map, source, zIndex = 0, opacity = 1,
}) {
    const [tileLayer, setTileLayer] = useState(undefined);

    useEffect(() => {
        if (!map) return undefined;

        const tileRasterLayer = new OLTileLayer({
            source,
            zIndex,
        });
        map.addLayer(tileRasterLayer);
        tileRasterLayer.setZIndex(zIndex);
        tileRasterLayer.setOpacity(opacity);

        setTileLayer(tileRasterLayer);

        return () => {
            if (map) {
                map.removeLayer(tileRasterLayer);
            }
        };
    }, [map, JSON.stringify(source.urls)]);

    useEffect(() => {
        if (!tileLayer) return;
        tileLayer.setOpacity(opacity);
    }, [opacity]);

    return null;
}

export default TileLayer;

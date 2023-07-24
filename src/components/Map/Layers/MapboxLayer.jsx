import { useContext, useState, useEffect } from 'react';
import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import Map from 'ol/Map';
import MapboxVector from 'ol/layer/MapboxVector';
import TileLayer from 'ol/layer/Tile';
import { toLonLat, get } from 'ol/proj';
import MapContext from '../MapContext';
import VectorTileLayer from 'ol/layer/VectorTile.js'
import * as olSource from 'ol/source';

function MapboxLayer({ zIndex = 1, opacity = 1, styleUrl, accessToken }) {
  const { map } = useContext(MapContext);
  const [mapboxLayer, setMapboxLayer] = useState(false);

  useEffect(() => {
    if (!map) return;

    // const mbLayer = new MapboxVector({
    //   styleUrl: styleUrl,
    //   attributionControl: true,
    //   scrollZoom: false,
    //   accessToken: accessToken,
    // });

    let styleUrlParsed = styleUrl.replace("mapbox://", "");
    styleUrlParsed = styleUrlParsed.replace("styles/", "styles/v1/");

    const layer = new TileLayer({
      source: new olSource.XYZ({
        url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
        tileSize: 256
      })
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
  }, [styleUrl, accessToken]);

  useEffect(() => {
    if (!mapboxLayer) return;
    mapboxLayer.setOpacity(opacity);
  }, [opacity]);

  return null;
}

export default MapboxLayer;

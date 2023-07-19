import { useContext, useState, useEffect } from "react";
import OLTileLayer from "ol/layer/Tile";
import MapContext from "../MapContext";

const TileLayer = ({ source, zIndex = 0, opacity = 1 }) => {
  const { map } = useContext(MapContext);
  const [tileLayer, setTileLayer] = useState(false);

  useEffect(() => {
    if (!map) return;

    let tileLayer = new OLTileLayer({
      source,
      zIndex,
    });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);
    tileLayer.setOpacity(opacity);

    setTileLayer(tileLayer);

    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [JSON.stringify(source.urls)]);

  useEffect(() => {
    if (!tileLayer) return;
    tileLayer.setOpacity(opacity);
  }, [opacity]);

  return null;
};

export default TileLayer;

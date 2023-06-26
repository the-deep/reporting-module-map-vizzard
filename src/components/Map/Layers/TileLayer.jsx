import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import OLTileLayer from "ol/layer/Tile";

const TileLayer = ({ source, zIndex = 0, opacity = 1 }) => {

  const { map } = useContext(MapContext);
  
  useEffect(() => {
    if (!map) return;

    let tileLayer = new OLTileLayer({
      source,
      zIndex,
    });
    map.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);
    tileLayer.setOpacity(opacity);

    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
}, [JSON.stringify(source.urls)]);

  return null;
};

export default TileLayer;

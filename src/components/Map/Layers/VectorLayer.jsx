import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import OLVectorLayer from "ol/layer/Vector";

const VectorLayer = ({ source, style, zIndex = 1, opacity = 1 }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    let vectorLayer = new OLVectorLayer({
      source,
      style,
    });
    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setOpacity(opacity);
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source, zIndex]);

  return null;
};

export default VectorLayer;

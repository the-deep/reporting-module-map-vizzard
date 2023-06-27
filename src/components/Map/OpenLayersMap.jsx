import React, { useRef, useContext, seState, useEffect } from "react";
import "./Map.css";
import * as ol from "ol";
import MapContext from "./MapContext";

const OpenLayersMap = ({ children, setMap, zoom, center, height }) => {
  const mapRef = useRef();
  const { map } = useContext(MapContext);

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: []
    };
    let mapObject = new ol.Map(options);

    mapObject.getViewport().addEventListener('mouseout', function(evt){
      // console.info('out');
  }, false);

    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);
  
  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  return (
      <div ref={mapRef} className="ol-map" style={{ height: height }}>
        {children}
      </div>
  );
};

export default OpenLayersMap;

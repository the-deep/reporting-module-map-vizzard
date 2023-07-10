import React, { useRef, useContext, seState, useEffect } from "react";
import "./Map.css";
import * as ol from "ol";
import MapContext from "./MapContext";
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';

const OpenLayersMap = ({ children, setMap, zoom, center, showScale, scaleUnits, scaleBar, scaleBarPosition}) => {
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

    // mapObject.getViewport().addEventListener('mouseout', function(evt){
      // console.info('out');
  // }, false);

  if(showScale){
    let scaleClassName = 'ol-scale-line';
    if(scaleBar) scaleClassName = 'ol-scale-bar';
    scaleClassName = 'scalePos'+scaleBarPosition + ' '+scaleClassName;
    let control = new ScaleLine({
      units: scaleUnits,
      bar: scaleBar,
      className: scaleClassName,
      minWidth: 100
    });
    mapObject.addControl(control);
  }

    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    console.log('zoom');
    map.getView().setZoom(zoom);
  }, [zoom]);
  
  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  useEffect(() => {
    console.log(scaleUnits);
    if (!map) return;
    map.getControls().forEach(function(control) {
      if (control instanceof ScaleLine) {
        map.removeControl(control);
      }
    }, this);
    if(showScale){
      let scaleClassName = 'ol-scale-line';
      if(scaleBar) scaleClassName = 'ol-scale-bar';
      scaleClassName = 'scalePos'+scaleBarPosition + ' '+scaleClassName;
      let control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100
      });
      map.addControl(control);
    }
  }, [showScale, scaleUnits, scaleBar, scaleBarPosition]);


  return (
      <div ref={mapRef} className="ol-map" style={{height: '100%'}}>
        {children}
      </div>
  );
};

export default OpenLayersMap;

import React, { useRef, useContext, seState, useEffect } from "react";
import "./Map.css";
import * as ol from "ol";
import MapContext from "./MapContext";
import { ScaleLine, Zoom, defaults as defaultControls } from "ol/control.js";
import { MouseWheelZoom } from "ol/interaction";

const OpenLayersMap = ({
  children,
  setMap,
  zoom,
  center,
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableZoomControls,
  zoomControlsPosition
}) => {
  const mapRef = useRef();
  const { map } = useContext(MapContext);
  
  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      overlays: [],
      controls: []
    };

   

    let mapObject = new ol.Map(options);

    // mapObject.getViewport().addEventListener('mouseout', function(evt){
    // console.info('out');
    // }, false);

    if (showScale) {
      let scaleClassName = "ol-scale-line";
      if (scaleBar) scaleClassName = "ol-scale-bar";
      scaleClassName = "scalePos" + scaleBarPosition + " " + scaleClassName;
      let control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
      });
      mapObject.addControl(control);
    }

    if (enableMouseWheelZoom) {
      mapObject.getInteractions().forEach(function (interaction) {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      mapObject.getInteractions().forEach(function (interaction) {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(false);
        }
      }, this);
    }

    if (enableZoomControls) {
      mapObject.addControl(new Zoom({delta: 0.3, className: 'ol-zoom POS-'+zoomControlsPosition}));
    }

    mapObject.setTarget(mapRef.current);
    setMap(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom, enableMouseWheelZoom]);

  useEffect(() => {
    if (!map) return;

    map.getControls().forEach(function (control) {
      if (control instanceof Zoom) {
        map.removeControl(control);
      }
    })

    if (enableZoomControls) {
      map.addControl(new Zoom({delta: 0.3, className: 'ol-zoom POS-'+zoomControlsPosition}));
    }
  }, [enableZoomControls, zoomControlsPosition]);



  

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  useEffect(() => {
    if (!map) return;
    if (enableMouseWheelZoom) {
      map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(false);
        }
      }, this);
    }
  }, [enableMouseWheelZoom]);

  useEffect(() => {
    if (!map) return;
    map.getControls().forEach(function (control) {
      if (control instanceof ScaleLine) {
        map.removeControl(control);
      }
    }, this);
    if (showScale) {
      let scaleClassName = "ol-scale-line";
      if (scaleBar) scaleClassName = "ol-scale-bar";
      scaleClassName = "scalePos" + scaleBarPosition + " " + scaleClassName;
      let control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
      });
      map.addControl(control);
    }
  }, [showScale, scaleUnits, scaleBar, scaleBarPosition]);

  return (
    <div ref={mapRef} className="ol-map" style={{ height: "100%" }}>
      {children}
    </div>
  );
};

export default OpenLayersMap;

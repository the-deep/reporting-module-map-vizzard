import React, { useRef, useEffect } from 'react';
import * as ol from 'ol';
import { ScaleLine, Zoom } from 'ol/control';
import { MouseWheelZoom, DoubleClickZoom, defaults } from 'ol/interaction';
import styles from './Map.module.css';

function OpenLayersMap({
  setMapObj,
  map,
  children,
  setMap,
  zoom,
  minZoom,
  maxZoom,
  center,
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableDoubleClickZoom,
  enableZoomControls,
  zoomControlsPosition,
}) {
  const mapRef = useRef();
  const zoomDelta = 0.4;

  // on component mount
  useEffect(() => {
    const options = {
      view: new ol.View({
        zoom,
        center,
        minZoom,
        maxZoom,
      }),
      layers: [],
      overlays: [],
      controls: [],
      interactions: defaults({
        zoomDelta,
      }),
    };

    const mapObject = new ol.Map(options);

    if (showScale) {
      let scaleClassName = 'ol-scale-line';
      if (scaleBar) scaleClassName = 'ol-scale-bar';
      const scalePosClass = `scalePos${scaleBarPosition}`;
      scaleClassName = `${styles[scalePosClass]} ${scaleClassName}`;
      const control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
      });
      mapObject.addControl(control);
    }

    if (enableMouseWheelZoom) {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(false);
        }
      }, this);
    }

    // enableDoubleClickZoom
    if (enableDoubleClickZoom) {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof DoubleClickZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof DoubleClickZoom) {
          interaction.setActive(false);
        }
      }, this);
    }

    if (enableZoomControls) {
      const zoomClass = `${styles.ol - zoom} ${styles[`POS-${zoomControlsPosition}`]}`;
      mapObject.addControl(new Zoom({ delta: zoomDelta, className: zoomClass }));
    }

    mapObject.setTarget(mapRef.current);
    if (setMap) setMap(mapObject);
    if (setMapObj) setMapObj(mapObject);
    return () => mapObject.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!map) return;
    // console.log([zoom, minZoom, maxZoom]);
    map.getView().setMinZoom(parseFloat(minZoom));
    map.getView().setMaxZoom(parseFloat(maxZoom));
    map.getView().setZoom(zoom);
  }, [zoom, minZoom, maxZoom]);

  useEffect(() => {
    if (!map) return;

    map.getControls().forEach((control) => {
      if (control instanceof Zoom) {
        map.removeControl(control);
      }
    });

    if (enableZoomControls) {
      const zoomClass = `ol-zoom ${styles[`POS-${zoomControlsPosition}`]}`;
      map.addControl(new Zoom({ delta: zoomDelta, className: zoomClass }));
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
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(false);
        }
      }, this);
    }
  }, [enableMouseWheelZoom]);

  useEffect(() => {
    if (!map) return;
    if (enableDoubleClickZoom) {
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof DoubleClickZoom) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof DoubleClickZoom) {
          interaction.setActive(false);
        }
      }, this);
    }
  }, [enableDoubleClickZoom]);

  useEffect(() => {
    if (!map) return;
    map.getControls().forEach((control) => {
      if (control instanceof ScaleLine) {
        map.removeControl(control);
      }
    }, this);
    if (showScale) {
      let scaleClassName = 'ol-scale-line';
      if (scaleBar) scaleClassName = 'ol-scale-bar';
      const scalePosClass = `scalePos${scaleBarPosition}`;
      scaleClassName = `${styles[scalePosClass]} ${scaleClassName}`;
      const control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
      });
      map.addControl(control);
    }
  }, [showScale, scaleUnits, scaleBar, scaleBarPosition]);

  return (
    <div ref={mapRef} className="ol-map" style={{ height: '100%' }}>
      {children}
    </div>
  );
}

export default OpenLayersMap;

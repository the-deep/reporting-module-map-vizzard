import React, { useRef, useEffect, useState } from 'react';
import * as ol from 'ol';
import TileLayer from 'ol/layer/Tile';
import * as olSource from 'ol/source';
import { OverviewMap, ScaleLine, Zoom } from 'ol/control';
import {
  MouseWheelZoom,
  DragPan,
  DoubleClickZoom,
  defaults,
} from 'ol/interaction';
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
  showOverview,
  overviewMapPosition = 'bottomRight',
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableDragPan = true,
  enableDoubleClickZoom,
  enableZoomControls,
  zoomControlsPosition,
  paddingBottom = 0,
}) {
  const mapRef = useRef();
  const bottomRight = useRef();
  const topRight = useRef();
  const bottomLeft = useRef();
  const topLeft = useRef();

  const position = {
    bottomRight,
    topRight,
    topLeft,
    bottomLeft,
  };

  const zoomDelta = 0.4;
  const [overviewMap, setOverviewMap] = useState(null);
  const mapboxToken = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';

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

    mapObject.getControls().forEach((control) => {
      if (control instanceof ScaleLine) {
        mapObject.removeControl(control);
      }
    }, this);

    if (showScale) {
      let scaleClassName = 'ol-scale-line';
      if (scaleBar) scaleClassName = 'ol-scale-bar';
      const control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
        target: position[scaleBarPosition].current.getElementsByClassName('scale')[0],
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

    if (enableDragPan) {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof DragPan) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      mapObject.getInteractions().forEach((interaction) => {
        if (interaction instanceof DragPan) {
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

    mapObject.getControls().forEach((control) => {
      if (control instanceof OverviewMap) {
        mapObject.removeControl(control);
      }
    });

    if (showOverview) {
      const styleUrl = 'mapbox://styles/matthewsmawfield/clo2texcn00hs01qsf0mg6drz';
      let styleUrlParsed = styleUrl.replace('mapbox://', '');
      styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

      const layer = new TileLayer({
        source: new olSource.XYZ({
          url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
          tileSize: 512,
          preload: 10,
          crossOrigin: 'anonymous',
        }),
      });

      position[overviewMapPosition].current.getElementsByClassName('overview')[0].innerHTML = '';

      const overviewMapControl = new OverviewMap({
        // see in overviewmap-custom.html to see the custom CSS used
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [
          layer,
        ],
        collapsible: false,
        collapsed: false,
        target: position[overviewMapPosition].current.getElementsByClassName('overview')[0],
      });
      mapObject.addControl(overviewMapControl);
      setOverviewMap(overviewMapControl);
    }

    mapObject.setTarget(mapRef.current);
    if (setMap) setMap(mapObject);
    if (setMapObj) setMapObj(mapObject);
    return () => {
      mapObject.removeControl(overviewMap);
      mapObject.getControls().forEach((control) => {
        if (control instanceof ScaleLine) {
          mapObject.removeControl(control);
        }
      }, this);
      mapObject.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    let newMinZoom = minZoom;
    if (zoom < minZoom) newMinZoom = zoom;
    map.getView().setMinZoom(parseFloat(newMinZoom));
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

  useEffect(() => {
    if (!map) return;

    map.getControls().forEach((control) => {
      if (control instanceof OverviewMap) {
        map.removeControl(control);
      }
    });

    position[overviewMapPosition].current.getElementsByClassName('overview')[0].innerHTML = '';

    if (showOverview) {
      const styleUrl = 'mapbox://styles/matthewsmawfield/clo2texcn00hs01qsf0mg6drz';
      let styleUrlParsed = styleUrl.replace('mapbox://', '');
      styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

      const layer = new TileLayer({
        source: new olSource.XYZ({
          url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
          tileSize: 512,
          preload: 10,
          crossOrigin: 'anonymous',
        }),
      });

      const overviewMapControl = new OverviewMap({
        // see in overviewmap-custom.html to see the custom CSS used
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [
          layer,
        ],
        target: position[overviewMapPosition].current.getElementsByClassName('overview')[0],
        collapsible: false,
        collapsed: false,
      });
      map.addControl(overviewMapControl);
    }
  }, [showOverview, overviewMapPosition]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [JSON.stringify(center)]);

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
    if (enableDragPan) {
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof DragPan) {
          interaction.setActive(true);
        }
      }, this);
    } else {
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof DragPan) {
          interaction.setActive(false);
        }
      }, this);
    }
  }, [enableDragPan]);

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
      const control = new ScaleLine({
        units: scaleUnits,
        bar: scaleBar,
        className: scaleClassName,
        minWidth: 100,
        target: position[scaleBarPosition].current.getElementsByClassName('scale')[0],
      });
      map.addControl(control);
    }
  }, [showScale, scaleUnits, scaleBar, scaleBarPosition]);

  return (
    <div ref={mapRef} className="ol-map" style={{ height: '100%' }}>
      {children}
      <div id="bottomRight" ref={bottomRight} style={{ paddingBottom: (paddingBottom - 20) }} className={styles.mapBottomRight}>
        <div className="overview" />
        <div className="scale" />
      </div>
      <div id="topRight" ref={topRight} className={styles.mapTopRight}>
        <div className="scale" />
        <div className="overview" />
      </div>
      <div id="topLeft" ref={topLeft} className={styles.mapTopLeft}>
        <div className="scale" />
        <div className="overview" />
      </div>
      <div id="bottomLeft" ref={bottomLeft} style={{ paddingBottom: (paddingBottom - 30) }} className={styles.mapBottomLeft}>
        <div className="overview" style={{ paddingBottom: 2 }} />
        <div className="scale" style={{ marginTop: 3, marginBottom: 2 }} />
      </div>
    </div>
  );
}

export default OpenLayersMap;

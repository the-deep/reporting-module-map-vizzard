import React, { useState, useMemo, useContext, useEffect } from "react";
import { TileLayer, VectorLayer, MapboxLayer, MaskLayer } from "./Layers";
import { Style, Icon, Fill, Stroke, Circle, Image } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector, mask } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import "bootstrap/dist/css/bootstrap.css";
import { addCircles, addSymbols } from "./Layers/SymbolLayer";
import MapContext from "./MapContext";
import OpenLayersMap from "./OpenLayersMap";
import styles from "./Map.module.css";

const Map = ({
  setMapObj,
  layers,
  height,
  width,
  zoom,
  center,
  mainTitle,
  subTitle,
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableZoomControls,
  zoomControlsPosition
}) => {
  const [renderLayers, setRenderLayers] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    let renderLayersArr = [];

    layers.forEach(function (d, i) {
      if (d.type == "symbol") {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
            key={"key" + i}
            source={vector({ features: addSymbols(d) })}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == "osm") {
        renderLayersArr[i] = d.visible > 0 && (
          <TileLayer
            key={"key" + i}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == "polygon") {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
            key={"key" + i}
            source={vector({
              features: new GeoJSON().readFeatures(d.data, {
                featureProjection: get("EPSG:3857"),
              }),
            })}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            showLabels={d.showLabels}
            labelColumn={d.labelColumn}
            declutter={true}
          />
        );
      }
      if (d.type == "mapbox") {
        renderLayersArr[i] = d.visible > 0 && (
          <MapboxLayer
            key={"key" + i}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == "mask") {
        var style = new Style({
          stroke: new Stroke({
            width: 1,
            color: "transparent",
          }),
          fill: new Fill({
            color: "#FFF",
          }),
        });
        renderLayersArr[i] = d.visible > 0 && (
          <MaskLayer
            key={"key" + i}
            source={mask()}
            polygon={d.mask}
            zIndex={d.zIndex}
            opacity={d.opacity}
            blur={d.blur}
            style={style}
          />
        );
      }
    });
    setRenderLayers(renderLayersArr);
  }, [layers]);

  return (
    <MapContext.Provider value={{ map }}>
    <div
      className={styles.mapContainer}
      style={{ height: height + "px", width: width + "px" }}
    >
      <div className={styles.mapTitle}>
        <div className={styles.mainTitle}>{mainTitle}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
      <OpenLayersMap
        center={fromLonLat([center.lon, center.lat])}
        zoom={zoom}
        setMapObj={setMapObj}
        setMap={setMap}
        showScale={showScale}
        scaleUnits={scaleUnits}
        scaleBar={scaleBar}
        scaleBarPosition={scaleBarPosition}
        enableMouseWheelZoom={enableMouseWheelZoom}
        enableZoomControls={enableZoomControls}
        zoomControlsPosition={zoomControlsPosition}
      >
        {renderLayers}
      </OpenLayersMap>
    </div>
    </MapContext.Provider>
  );
};

export default Map;

Map.defaultProps = {
  zoom: 5,
  mainTitle: "Main title",
  subTitle: "Sub-title",
  center: { lon: 30.21, lat: 15.86 },
  height: 400,
  width: 700,
  children: null,
};
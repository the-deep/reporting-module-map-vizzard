import React, { useState, useEffect } from "react";
import OpenLayersMap from "./OpenLayersMap";
import { TileLayer, VectorLayer, MapboxLayer, MaskLayer } from "./Layers";
import { Style, Icon, Fill, Stroke, Circle, Image } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector, mask } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import SDN_ADM0 from "./Data/sdn_adm0.json";
import SDN_ADM1 from "./Data/sdn_adm1.json";
import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";
import 'ol/ol.css';
import "bootstrap/dist/css/bootstrap.css";
import { isVariableStatement } from "typescript";
import { AddCircles, AddSymbols } from "./Layers/AddSymbol";

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({
        color: "#FFF",
      }),
      stroke: new Stroke({
        color: "#000",
        width: 2,
      }),
    }),
  });
  let cities = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return cities;
}

const Map = ({ layers, setMap, height, width, zoom, center, mainTitle, subTitle, showScale }) => {
  const [renderLayers, setRenderLayers] = useState([]);

  useEffect(() => {
    let renderLayersArr = [];

    layers.forEach(function (d, i) {
      if (d.type == "symbol") {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
            key={"key" + i}
            source={vector({ features: AddSymbols(d) })}
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
    <div id="map-container" style={{ height: height+'px', width: width+'px' }}>
      <div id="map-title">
        <div id="main-title">{mainTitle}</div>
        <div id="sub-title">{subTitle}</div>
      </div>
      <OpenLayersMap
        center={fromLonLat([center.lon, center.lat])}
        zoom={zoom}
        setMap={setMap}
        showScale={showScale}
      >
        {renderLayers}
        <Controls>{/* <FullScreenControl /> */}</Controls>
      </OpenLayersMap>
    </div>
  );
};

export default Map;

Map.defaultProps = {
  zoom: 5,
  // layers: mapConfig.layers,
  mainTitle: "Main title",
  subTitle: "Sub-title",
  center: {lon: 30.21, lat: 15.86},
  height: 400,
  width: 700,
  children: null,
};

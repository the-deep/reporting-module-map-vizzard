import React, { useState, useEffect } from "react";
import OpenLayersMap from "./OpenLayersMap";
import { Layers, TileLayer, VectorLayer, MapboxLayer } from "./Layers";
import { Style, Icon, Fill, Stroke, Circle, Image } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import SDN_ADM0 from "./Data/sdn_adm0.json";
import SDN_ADM1 from "./Data/sdn_adm1.json";
import { Controls, FullScreenControl } from "./Controls";
import FeatureStyles from "./Features/Styles";
import 'bootstrap/dist/css/bootstrap.css';
import { isVariableStatement } from "typescript";
import {AddCircles, AddSymbols} from "./Layers/AddPoints"

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                    color: '#FFF'
                }),
                stroke: new Stroke({
                  color: '#000',
                  width: 2
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
  return cities
}

const Map = ({layers, height, zoom, center, mainTitle, subTitle}) => {
  const [showLayer0, setShowLayer0] = useState(true);
  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(false);
  
  let renderLayers = [];

  layers.forEach(function(d,i){
    if(d.type=='point'){
      renderLayers.push(d.visible > 0 && <VectorLayer key={"key"+i} source={vector({features: AddSymbols(d)})} zIndex={d.zIndex} opacity={d.opacity}/>)
    }
    if(d.type=='osm'){
      renderLayers.push(d.visible > 0 && <TileLayer key={"key"+i} source={osm()} zIndex={d.zIndex} opacity={d.opacity}/>)
    }
    if(d.type=='polygon'){

      var style = new Style({
        stroke: new Stroke({
          width: 2,
          color: d.style.stroke.hex8
        }),
        fill: new Fill({
          color: d.style.fill.hex8
        })
      });

      renderLayers.push(d.visible > 0 && <VectorLayer
        key={"key"+i} source={vector({
          features: new GeoJSON().readFeatures(d.data, {
            featureProjection: get("EPSG:3857"),
          }),
        })}
        zIndex={d.zIndex}
        opacity={d.opacity}
        style={style}
      />)
    }
    if(d.type=='mapbox'){
      renderLayers.push(d.visible > 0 && <MapboxLayer key={"key"+i} source={osm()} zIndex={d.zIndex} opacity={d.opacity}/>)
    }
  });

  // useEffect(() => {
  //   renderLayers = [];
  //   layers.forEach(function(d,i){
  //     if(d.type=='point'){
  //       renderLayers.push(d.visible > 0 && <VectorLayer key={"key"+i} source={vector({features: AddSymbols(d)})} zIndex={d.zIndex} opacity={d.opacity}/>)
  //     }
  //     if(d.type=='osm'){
  //       renderLayers.push(d.visible > 0 && <TileLayer key={"key"+i} source={osm()} zIndex={d.zIndex} opacity={d.opacity}/>)
  //     }
  //     if(d.type=='polygon'){
  //       renderLayers.push(d.visible > 0 && <VectorLayer
  //         key={"key"+i} source={vector({
  //           features: new GeoJSON().readFeatures(d.data, {
  //             featureProjection: get("EPSG:3857"),
  //           }),
  //         })}
  //         zIndex={d.zIndex}
  //         opacity={d.opacity}
  //         style={FeatureStyles.MultiPolygon}
  //       />)
  //     }
  //     if(d.type=='mapbox'){
  //       renderLayers.push(d.visible > 0 && <MapboxLayer key={"key"+i} source={osm()} zIndex={d.zIndex} opacity={d.opacity}/>)
  //     }
  //   });
  // }, [layers]);


  return (
    <div id="map-container"  style={{height: height}}>
      <div id="map-title">
        <div id="main-title">{mainTitle}</div>
        <div id="sub-title">{subTitle}</div>
      </div>
      <OpenLayersMap center={fromLonLat(center)} zoom={zoom} height={height}>
        <Layers>
          {renderLayers}
        </Layers>
        <Controls>
          {/* <FullScreenControl /> */}
        </Controls>
      </OpenLayersMap>     
    </div>
  );
};

export default Map;

Map.defaultProps = {
  zoom: 5,
  // layers: mapConfig.layers,
  mainTitle: 'Main title',
  subTitle: 'Sub-title',
  center: [30.21, 15.86],
  height: 400,
  children: null
};

import React, { useState } from "react";
import OpenLayersMap from "./OpenLayersMap";
import { Layers, TileLayer, VectorLayer } from "./Layers";
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
import mapConfig from "./config.json";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.darfurCityLonLat, mapConfig.khartoumLonLat, mapConfig.portsaidLonLat];

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
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

const Map = ({height, zoom, center, mainTitle, subTitle}) => {
  const [showLayer0, setShowLayer0] = useState(true);
  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(false);
  const [showMarker, setShowMarker] = useState(true);
  const [features, setFeatures] = useState(addMarkers(markersLonLat));

  return (
<div class="row">
    <div id="map_layers" class="col-md-3">
      <div>
      <h3>Layers</h3>
      <input
        type="checkbox"
        checked={showLayer1}
        onChange={(event) => setShowLayer1(event.target.checked)}
      />{" "}
      SDN_ADM0.geojson
    </div>
    <div>
      <input
        type="checkbox"
        checked={showLayer2}
        onChange={(event) => setShowLayer2(event.target.checked)}
      />{" "}
      SDN_ADM1.geojson
    </div>
    <div>
      <input
        type="checkbox"
        checked={showMarker}
        onChange={(event) => setShowMarker(event.target.checked)}
      />{" "}
      cities.csv
    </div>
    <div>
      <input
        type="checkbox"
        checked={showLayer0}
        onChange={(event) => setShowLayer0(event.target.checked)}
      />{" "}
      OpenStreetMap Raster Tiles
    </div>
    </div>

    <div id="map-container" class="col-md-9" style={{height: height}}>
      <div id="map-title">
        <div id="main-title">{mainTitle}</div>
        <div id="sub-title">{subTitle}</div>
      </div>
      <OpenLayersMap center={fromLonLat(center)} zoom={zoom} height={height}>
        <Layers>
        {showLayer0 && (
          <TileLayer source={osm()} zIndex={-1} />
        )}
          {showLayer1 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(SDN_ADM0, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              zIndex={1}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showLayer2 && (
            <VectorLayer
              source={vector({
                features: new GeoJSON().readFeatures(SDN_ADM1, {
                  featureProjection: get("EPSG:3857"),
                }),
              })}
              zIndex={2}
              style={FeatureStyles.MultiPolygon}
            />
          )}
          {showMarker && <VectorLayer source={vector({ features })} zIndex={3}/>}
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </OpenLayersMap>
      
    </div>
    </div>
  );
};

export default Map;

Map.defaultProps = {
  zoom: 5,
  mainTitle: 'Main title',
  subTitle: 'Sub-title',
  center: [30.21, 15.86],
  height: 400,
  children: null
};

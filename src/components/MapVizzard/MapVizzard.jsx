import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import mapConfig from "./config.json";
import Map from "../Map";
import MapLayers from "../MapLayers";
import MapOptions from "../MapOptions";
import MapContext from "../Map/MapContext";

export const MapVizzard = ({ height, zoom, center, mainTitle, subTitle }) => {
  const [layers, setLayers] = useState(mapConfig.layers);
  const [activeLayer, setActiveLayer] = useState(4);
  const [map, setMap] = useState(null);

  return (
    <MapContext.Provider value={{ map }}>

    <div className="row">
      <div id="map_layers" className="col-md-3">
        <MapLayers
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      </div>
      <div id="map_options" className="col-md-3">
        <MapOptions
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
        />
      </div>
      <div id="map_panel" className="col-md-6">
        <Map
          layers={layers}
          height={height}
          center={center}
          zoom={zoom}
          setMap={setMap}
          mainTitle={mainTitle}
          subTitle={subTitle}
        />
      </div>
    </div>
    </MapContext.Provider>
  );
};

export default MapVizzard;

MapVizzard.propTypes = {};

MapLayers.defaultProps = {
  layers: mapConfig.layers,
};

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import mapConfig from "./config.json";
import Map from "../Map";
import MapLayers from "../MapLayers";
import MapOptions from "../MapOptions";
import MapContext from "../Map/MapContext";
import MapVizzardContext from "../MapVizzard/MapVizzardContext";

export const MapVizzard = ( ) => {
  const [layers, setLayers] = useState(mapConfig.layers);
  const [activeLayer, setActiveLayer] = useState(null);
  const [mapVizzard, setMapVizzard] = useState(null);
  const [mapObj, setMapObj] = useState(null);
  const [mapOptions, setMapOptions] = useState(mapConfig.mapOptions);

  return (
    <MapVizzardContext.Provider value={{ mapVizzard }}>
      <div className="">
    <div className="row flex-nowrap">
      <div id="map_layers" className="col-3">
        <MapLayers
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
        />
      </div>
      <div id="map_options" className="col">
        <MapOptions
          layers={layers}
          setLayers={setLayers}
          activeLayer={activeLayer}
          mapOptions={mapOptions}
          setMapOptions={setMapOptions}
          mapObj={mapObj}
        />
      </div>
      <div id="map_panel" className="col-7">
        <Map
          layers={layers}
          height={mapOptions.height}
          width={mapOptions.width}
          center={mapOptions.center}
          zoom={mapOptions.zoom}
          mainTitle={mapOptions.mainTitle}
          subTitle={mapOptions.subTitle}
          showScale={mapOptions.showScale}
          scaleUnits={mapOptions.scaleUnits}
          scaleBar={mapOptions.scaleBar}
          scaleBarPosition={mapOptions.scaleBarPosition}
          enableMouseWheelZoom={mapOptions.enableMouseWheelZoom}
          enableZoomControls={mapOptions.enableZoomControls}
          zoomControlsPosition={mapOptions.zoomControlsPosition}
          setMapObj={setMapObj}
        />
      </div>
    </div>
    </div>
    </MapVizzardContext.Provider>
  );
};

export default MapVizzard;

MapVizzard.propTypes = {};

MapLayers.defaultProps = {
  layers: mapConfig.layers,
};

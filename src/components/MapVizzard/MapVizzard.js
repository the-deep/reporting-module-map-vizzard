import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './maplayers.css';
import mapConfig from "./config.json";
import Map from '../Map';
import MapLayers from '../MapLayers';


export const MapVizzard = ({layers, height, zoom, center, mainTitle, subTitle}) => {
    
    const [layers2, setLayers] = useState(layers);
    const [val, setVal] = useState(0);
  
    function setOpeningLayers(layers) {
      setLayers(layers);
    }

    return (
        <div className="row">
          <div id="map_layers" className="col-md-4">
            <MapLayers val={val} layers={layers} setLayers={setOpeningLayers} setVal={setVal}/>
          </div>
          <div id="map_panel" className="col-md-8">
            <Map layers={layers} height={height} center={center} zoom={zoom} mainTitle={mainTitle} subTitle={subTitle}/>
          </div>
        </div>
      );
};
    
export default MapVizzard;

MapVizzard.propTypes = {
    
};

MapLayers.defaultProps = {
    layers: mapConfig.layers
};
    
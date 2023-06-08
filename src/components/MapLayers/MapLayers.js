import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './maplayers.css';
import LayerRow from "./LayerRow";

export const MapLayers = ({layers, setLayers, val, setVal, activeLayer, setActiveLayer}) => {

    const renderLayers = [];

    layers.sort(function(a, b){
        return a["zIndex"]-b["zIndex"];
     });

     layers.forEach(function(dd,ii){
        dd.zIndex = ii;
    });

    
    const updateLayers = (d, index) => {
        if(d=='remove'){
            layers.splice(index, 1)
        } else {
            layers[index] = d;
        }
        layers.sort(function(a, b){
            return a["zIndex"]-b["zIndex"];
         })
        layers.forEach(function(dd,ii){
            dd.zIndex = ii;
        });
        setLayers(layers);
        setVal(val+1);
    }

    layers.sort(function(a, b){
        return b["zIndex"]-a["zIndex"];
     });

    layers.forEach(function(d,i){
        renderLayers.push(<LayerRow key={"key"+i} d={d} update={updateLayers} layerIndex={i} activeLayer={activeLayer} setActiveLayer={setActiveLayer}/>)
    });

    return (
    <div>
    <div className="layersPanel">
        <h1>Layers</h1>
    </div>
    <div className="layersPanelBody">
        { renderLayers }
    </div>
    </div>
    )
};
    
export default MapLayers;

MapLayers.propTypes = {
    
};

MapLayers.defaultProps = {
    
};
    
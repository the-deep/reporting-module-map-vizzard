import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import './maplayers.css';
import LayerRow from "./LayerRow";

export const MapLayers = ({layers, setLayers, val, setVal, activeLayer, setActiveLayer}) => {
    
    const renderLayers = [];
    
    // layers.sort(function(a, b){
    //     return a["zIndex"]-b["zIndex"];
    //  });
    
    //  layers.forEach(function(dd,ii){
    //     dd.zIndex = ii;
    // });
    
    const updateLayers = (d, id) => {
        let l = layers.filter((dd)=>dd.id == id);
        if(d=='remove'){
            l.forEach(f => layers.splice(layers.findIndex(e => e.id === f.id),1));
        } else {
            l = d;
        }
        // layers.sort(function(a, b){
        //     return a["zIndex"]-b["zIndex"];
        //  })
        // layers.forEach(function(dd,ii){
        //     dd.zIndex = ii;
        // });
        setLayers([...layers]);
        // setLayers(layers);
        // setVal(val+1);
    }
    
    const mLayers = layers.sort(function(a, b){
        return b["zIndex"]-a["zIndex"];
    });
    
    mLayers.forEach(function(d,i){
        renderLayers.push(<LayerRow key={"key"+i} d={d} update={updateLayers} activeLayer={activeLayer} setActiveLayer={setActiveLayer}/>)
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
    
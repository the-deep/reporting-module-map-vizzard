import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import OptionsVector from "./OptionsVector";
import './mapoptions.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const MapOptions = ({layers, setLayers, val, setVal, activeLayer}) => {


    const updateLayer = (d, activeLayerIndex) => {
        // if(d=='remove'){
        //     layers.splice(index, 1)
        // } else {
        //     layers[index] = d;
        // }
        // layers.sort(function(a, b){
        //     return a["zIndex"]-b["zIndex"];
        //  })
        // layers.forEach(function(dd,ii){
        //     dd.zIndex = ii;
        // });
       layers.forEach(function(dd,ii){
            if(dd.id == activeLayerIndex){
                layers[ii] = d
            }
        })
        setLayers(layers);
        setVal(val+1);
    }

    const renderLayers = [];
    
    layers.forEach(function(dd,ii){
        console.log(dd);
        if(dd.id == activeLayer){
            if(dd.type=='polygon'){
                renderLayers.push(<OptionsVector key={'polygonOptions'} layer={dd} updateLayer={updateLayer} activeLayer={activeLayer}/>)
            }
        }
    })



   

    // layers.sort(function(a, b){
    //     return b["zIndex"]-a["zIndex"];
    //  });

    // layers.forEach(function(d,i){
    //     renderLayers.push(<LayerRow key={"key"+i} d={d} update={updateLayers} layerIndex={i}/>)
    // });

    return (
    <div className="mapOptions">
    <div className="mapOptionsPanel">
        <h1>Layer Options</h1>
    </div>
    <div className="mapOptionsPanelBody">
            { renderLayers }
    </div>
    </div>
    )
};
    
export default MapOptions;

MapOptions.propTypes = {
    
};

MapOptions.defaultProps = {
    
};
    
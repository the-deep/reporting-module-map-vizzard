import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import OptionsVector from "./OptionsVector";
import OptionsSymbol from "./OptionsSymbol";
import './mapoptions.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const MapOptions = ({layers, setLayers, val, setVal, activeLayer}) => {

    const updateLayer = (d, id) => {
       layers.forEach(function(dd,ii){
            if(dd.id == id){
                layers[ii] = d
            }
        })
        setLayers([...layers]);
    }

    const renderLayers = [];
    
    layers.forEach(function(dd,ii){
        if(dd.id == activeLayer){
            if(dd.type=='polygon'){
                renderLayers.push(<OptionsVector key={'polygonOptions'} layer={dd} updateLayer={updateLayer} activeLayer={activeLayer}/>)
            }
            if(dd.type=='symbol'){
                renderLayers.push(<OptionsSymbol key={'polygonOptions'} layer={dd} updateLayer={updateLayer} activeLayer={activeLayer}/>)
            }
        }
    })

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
    
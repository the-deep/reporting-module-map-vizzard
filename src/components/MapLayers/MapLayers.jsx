import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./maplayers.css";
import LayerRow from "./LayerRow";

export const MapLayers = ({
  layers,
  setLayers,
  val,
  setVal,
  activeLayer,
  setActiveLayer,
}) => {
  const renderLayers = [];

  const updateLayers = (d, id) => {
    let l = layers.filter((dd) => dd.id == id);
    if (d == "remove") {
      l.forEach((f) =>
        layers.splice(layers.findIndex((e) => e.id === f.id),1)
      );
    } else {
      l = d;
    }
    setLayers([...layers]);
  };

  const mLayers = layers.sort(function (a, b) {
    return b["zIndex"] - a["zIndex"];
  });

  mLayers.forEach(function (d, i) {
    renderLayers.push(
      <LayerRow
        key={"key" + i}
        d={d}
        update={updateLayers}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    );
  });

  function layersBgClick(){
    setActiveLayer(null);
  }
  
  return (
    <div className="layersPanelContainer">
      <div className="layersPanel">
        <h1>Layers</h1>
      </div>
      <div className="layersPanelBody">{renderLayers}</div>
      <div className="layersPanelBg" onClick={layersBgClick}></div>
    </div>
  );
};

export default MapLayers;

MapLayers.propTypes = {};

MapLayers.defaultProps = {};

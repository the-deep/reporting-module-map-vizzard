import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./MapLayers.module.css";
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
    if(setLayers) setLayers([...layers]);
  };

  const mLayers = layers.sort(function (a, b) {
    return b["zIndex"] - a["zIndex"];
  });

  mLayers.forEach(function (d, i) {
    renderLayers.push(
      <LayerRow
        key={"key" + i}
        row={d}
        update={updateLayers}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
    );
  });

  function layersBgClick(){
    if(setActiveLayer) setActiveLayer(null);
  }
  
  return (
    <div className={styles.layersPanelContainer}>
      <div className={styles.layersPanel}>
        <h1>Layers</h1>
      </div>
      <div className={styles.layersPanelBody}>{renderLayers}</div>
      <div className={styles.layersPanelBg} onClick={layersBgClick}></div>
    </div>
  );
};

export default MapLayers;

MapLayers.propTypes = {};

MapLayers.defaultProps = {};
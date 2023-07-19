import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./MapLayers.module.css";
import LayerRow from "./LayerRow";

export const MapLayers = ({
  layers,
  setLayers,
  activeLayer,
  setActiveLayer
}) => {

  const updateLayers = (d, id) => {
    if (d == "remove") {
      let newLayersObj = layers.filter((obj) => obj.id !== id);
      if (setLayers) setLayers([...newLayersObj]);
    } else {
      if (setLayers) setLayers([...layers]);
    }
  };

  function layersBgClick() {
    if (setActiveLayer) setActiveLayer(null);
  }

  const mLayers = [...layers].sort(function (a, b) {
    return b["zIndex"] - a["zIndex"];
  });

  const rows = mLayers.map((row) => (
    <LayerRow
      key={"key" + row.id}
      row={row}
      update={updateLayers}
      activeLayer={activeLayer}
      setActiveLayer={setActiveLayer}
    />
  ));

  return (
    <div className={styles.layersPanelContainer}>
      <div className={styles.layersPanel}>
        <h1>Layers</h1>
      </div>
      <div className={styles.layersPanelBody}>{rows}</div>
      <div className={styles.layersPanelBg} onClick={layersBgClick}></div>
    </div>
  );
};

export default MapLayers;
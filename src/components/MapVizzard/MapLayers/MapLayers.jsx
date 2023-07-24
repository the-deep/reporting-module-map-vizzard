import React from 'react';
import styles from './MapLayers.module.css';
import LayerRow from './LayerRow';

function MapLayers({
  layers,
  setLayers,
  activeLayer,
  setActiveLayer,
}) {
  const updateLayers = (d, id) => {
    const layersClone = [...layers];
    if (d === 'remove') {
      const newLayersObj = layersClone.filter((obj) => obj.id !== id);
      if (setLayers) setLayers([...newLayersObj]);
    } else {
      layersClone.forEach((dd, ii) => {
        if (dd.id === id) {
          layersClone[ii] = d;
        }
      });
      if (setLayers) setLayers([...layersClone]);
    }
  };

  function layersBgClick() {
    if (setActiveLayer) setActiveLayer(null);
  }

  const mLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const rows = mLayers.map((row) => (
    <LayerRow
      key={`key${row.id}`}
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
      <div className={styles.layersPanelBg} onClick={layersBgClick} role="presentation" />
    </div>
  );
}

export default MapLayers;

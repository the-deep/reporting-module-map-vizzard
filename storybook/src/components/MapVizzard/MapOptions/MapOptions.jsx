import React, { useMemo } from 'react';
import OptionsVector from './OptionsVector';
import OptionsLine from './OptionsLine';
import OptionsMask from './OptionsMask';
import OptionsSymbol from './OptionsSymbol';
import OptionsHeatmap from './OptionsHeatmap';
import OptionsHexbin from './OptionsHexbin';
import OptionsTile from './OptionsTile';
import OptionsMapbox from './OptionsMapbox';
import OptionsMapGeneral from './OptionsMapGeneral';
import styles from './MapOptions.module.css';

function MapOptions({
  layers,
  setLayers,
  activeLayer,
  mapOptions,
  setMapOptions,
  mapObj,
}) {
  const map = mapObj;

  const render = useMemo(() => {
    const updateLayer = (d, id) => {
      const layersClone = [...layers];
      layersClone.forEach((dd, ii) => {
        if (dd.id === id) {
          layersClone[ii] = d;
        }
      });
      if (setLayers) setLayers([...layersClone]);
    };
    const updateMapOptions = (d) => {
      setMapOptions({ ...d });
    };

    const renderLayers = [];
    if (activeLayer === null) {
      renderLayers.push(
        <OptionsMapGeneral
          key="generalMapOptions"
          mapOptions={mapOptions}
          updateMapOptions={updateMapOptions}
        />,
      );
    } else {
      layers.forEach((dd) => {
        if (dd.id === activeLayer) {
          if (dd.type === 'polygon') {
            renderLayers.push(
              <OptionsVector
                key="polygonOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'line') {
            renderLayers.push(
              <OptionsLine
                key="lineOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'symbol') {
            renderLayers.push(
              <OptionsSymbol
                key="symbolOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'heatmap') {
            renderLayers.push(
              <OptionsHeatmap
                key="heatmapOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'hexbin') {
            renderLayers.push(
              <OptionsHexbin
                key="hexbinOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'mask') {
            renderLayers.push(
              <OptionsMask
                key="maskOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
                map={map}
              />,
            );
          }
          if (dd.type === 'mapbox') {
            renderLayers.push(
              <OptionsMapbox
                key="mapboxOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
          if (dd.type === 'osm') {
            renderLayers.push(
              <OptionsTile
                key="osmOptions"
                layer={dd}
                updateLayer={updateLayer}
                activeLayer={activeLayer}
              />,
            );
          }
        }
      });
    }
    return renderLayers;
  }, [map, activeLayer, setLayers, setMapOptions, layers, mapOptions]);

  return <div className={styles.mapOptions}>{render}</div>;
}

export default MapOptions;

MapOptions.propTypes = {};

MapOptions.defaultProps = {};

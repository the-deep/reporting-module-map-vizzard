import React, { useEffect } from 'react';
import { Draw, Modify, Snap } from 'ol/interaction';
import OptionsVector from './OptionsVector';
import OptionsMask from './OptionsMask';
import OptionsSymbol from './OptionsSymbol';
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

  useEffect(() => {
    if (!map) return;
    layers.forEach((dd) => {
      if (dd.id === activeLayer) {
        if (dd.type !== 'mask') {
          map.getInteractions().forEach((interaction) => {
            if (interaction instanceof Draw) {
              map.removeInteraction(interaction);
            }
            if (interaction instanceof Snap) {
              map.removeInteraction(interaction);
            }
            if (interaction instanceof Modify) {
              map.removeInteraction(interaction);
            }
          });
        }
      }
    });
  }, [activeLayer]);

  if (map) {
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof Draw) {
        map.removeInteraction(interaction);
      }
      if (interaction instanceof Snap) {
        map.removeInteraction(interaction);
      }
      if (interaction instanceof Modify) {
        map.removeInteraction(interaction);
      }
    });
    map.getLayers().forEach((el) => {
      // eslint-disable-next-line no-underscore-dangle
      if (el && el.values_.id === 'drawLayerMask') {
        map.removeLayer(el);
      }
    });
  }

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
        if (dd.type === 'symbol') {
          renderLayers.push(
            <OptionsSymbol
              key="polygonOptions"
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

  return <div className={styles.mapOptions}>{renderLayers}</div>;
}

export default MapOptions;

MapOptions.propTypes = {};

MapOptions.defaultProps = {};

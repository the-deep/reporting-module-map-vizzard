import React, { useState, useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import PropTypes from "prop-types";
import OptionsVector from "./OptionsVector";
import OptionsMask from "./OptionsMask";
import OptionsSymbol from "./OptionsSymbol";
import OptionsMapGeneral from "./OptionsMapGeneral";
import { Draw, Modify, Snap } from "ol/interaction";

import "./mapoptions.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const MapOptions = ({ layers, setLayers, val, setVal, activeLayer, mapOptions, setMapOptions }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    layers.forEach(function (dd, ii) {
      if (dd.id == activeLayer) {
        if (dd.type != "mask") {
          map.getInteractions().forEach(function (interaction) {
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
    map.getInteractions().forEach(function (interaction) {
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
    map.getLayers().forEach(function (el) {
      if (el && el.values_.id == "drawLayerMask") {
        map.removeLayer(el);
      }
    });
  }

  const updateLayer = (d, id) => {
    layers.forEach(function (dd, ii) {
      if (dd.id == id) {
        layers[ii] = d;
      }
    });
    setLayers([...layers]);
  };

  const updateMapOptions = (d) => {
    setMapOptions({...d});
  }

  const renderLayers = [];
  let layersHeader = 'Layer Options';
  
  if (activeLayer === null) {
    layersHeader = 'Map Options';
    renderLayers.push(
      <OptionsMapGeneral
        key={"generalMapOptions"}
        mapOptions={mapOptions}
        updateMapOptions={updateMapOptions}
      />
    );
  } else {
    layers.forEach(function (dd, ii) {
      if (dd.id == activeLayer) {
        if (dd.type == "polygon") {
          renderLayers.push(
            <OptionsVector
              key={"polygonOptions"}
              layer={dd}
              updateLayer={updateLayer}
              activeLayer={activeLayer}
            />
          );
        }
        if (dd.type == "symbol") {
          renderLayers.push(
            <OptionsSymbol
              key={"polygonOptions"}
              layer={dd}
              updateLayer={updateLayer}
              activeLayer={activeLayer}
            />
          );
        }
        if (dd.type == "mask") {
          renderLayers.push(
            <OptionsMask
              key={"maskOptions"}
              layer={dd}
              updateLayer={updateLayer}
              activeLayer={activeLayer}
            />
          );
        }
      }
    });
  }

  return (
    <div className="mapOptions">
      <div className="mapOptionsPanel">
        <h1>{layersHeader}</h1>
      </div>
      <div className="mapOptionsPanelBody">{renderLayers}</div>
    </div>
  );
};

export default MapOptions;

MapOptions.propTypes = {};

MapOptions.defaultProps = {};

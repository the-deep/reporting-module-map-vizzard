import React, { useState, useRef, useEffect } from 'react';

import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';

import saveFile from './saveFile';
import '../Map/ol.css';
import styles from './MapOptions/MapOptions.module.css';
import { rgba } from '../Map/helpers';
import Map from '../Map';
import MapLayers from './MapLayers';
import MapOptions from './MapOptions';

function MapVizzard({
  mapConfig,
  iframe = false,
  dashboard = false,
  print = false,
  paddingBottom = 0,
}) {
  const [layers, setLayers] = useState(mapConfig.layers);
  const [mapOptions, setMapOptions] = useState(mapConfig.mapOptions);
  const [activeLayer, setActiveLayer] = useState(null);
  const [mapObj, setMapObj] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  const inputFile = useRef(null);
  let embed = queryParameters.get('embed') || false;
  if (iframe === true) embed = true;
  let legendTopPadding = 60;
  if (dashboard) legendTopPadding = 135;
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  function onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      const content = JSON.parse(e.target.result);
      setMapOptions(content.mapOptions);
      setLayers(content.layers);
    };
  }

  useEffect(() => {
    setLayers(mapConfig.layers);
    setMapOptions(mapConfig.mapOptions);
  }, [mapConfig]);

  return (
    <div className={`${(embed ? styles.embed : '')}`}>
      <div className={`${styles.container}`}>
        {!embed && (
          <div id="map_toolbar" className={`${styles.mapToolbar}`}>
            <Button
              size="small"
              theme={theme}
              variant="outlined"
              onClick={() => {
                inputFile.current.click();
              }}
            >
              Open project
            </Button>
            &nbsp;
            <input type="file" id="file" ref={inputFile} style={{ display: 'none' }} onChange={onChangeFile.bind(this)} accept=".mvz, .json" />
            <Button
              size="small"
              theme={theme}
              variant="outlined"
              onClick={() => {
                const blob = new Blob([JSON.stringify({ mapOptions, layers })], { type: 'text/plain;charset=utf-8' });
                saveFile(blob, `${mapOptions.mainTitle}.mvz`);
              }}
            >
              Save
            </Button>
          </div>
        )}
        {!embed && (
          <div id="map_layers" className={`${styles.mapLayersContainer}`}>
            <MapLayers
              layers={layers}
              setLayers={setLayers}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
            />
          </div>
        )}
        {!embed && (
          <div className={`${styles.mapOptionsContainer}`}>
            <MapOptions
              layers={layers}
              setLayers={setLayers}
              activeLayer={activeLayer}
              mapOptions={mapOptions}
              setMapOptions={setMapOptions}
              mapObj={mapObj}
            />
          </div>
        )}
        <div id="map_panel" className={`${styles.mapPanel}`} style={{ fontFamily: mapOptions.fontStyle.fontFamily, color: rgba(mapOptions.fontStyle.color) }}>
          <Map
            center={mapOptions.center}
            dashboard={dashboard}
            dateText={mapOptions.dateText}
            embed={embed}
            enableDoubleClickZoom={mapOptions.enableDoubleClickZoom}
            enableDragPan={mapOptions.enableDragPan}
            enableMouseWheelZoom={mapOptions.enableMouseWheelZoom}
            enableZoomControls={mapOptions.enableZoomControls}
            fontStyle={mapOptions.fontStyle}
            headerStyle={mapOptions.headerStyle}
            height={mapOptions.height}
            layers={layers}
            legendPosition={mapOptions.legendPosition}
            legendTopPadding={legendTopPadding}
            mainTitle={mapOptions.mainTitle}
            maxZoom={mapOptions.maxZoom}
            minZoom={mapOptions.minZoom}
            overviewMapPosition={mapOptions.overviewMapPosition}
            paddingBottom={paddingBottom}
            primaryColor={mapOptions.primaryColor}
            print={print}
            scaleBar={mapOptions.scaleBar}
            scaleBarPosition={mapOptions.scaleBarPosition}
            scaleUnits={mapOptions.scaleUnits}
            setMapObj={setMapObj}
            showFooter={mapOptions.showFooter}
            showHeader={mapOptions.showHeader}
            showLegend={mapOptions.showLegend}
            showLogos={mapOptions.showLogos}
            showOverview={mapOptions.showOverview}
            showScale={mapOptions.showScale}
            sources={mapOptions.sources}
            subTitle={mapOptions.subTitle}
            width={mapOptions.width}
            zoom={mapOptions.zoom}
            zoomControlsPosition={mapOptions.zoomControlsPosition}
          />
        </div>
      </div>
    </div>
  );
}

export default MapVizzard;

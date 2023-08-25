import React, { useState } from 'react';
import '../Map/ol.css';
import styles from './MapOptions/MapOptions.module.css';
import { rgba } from './MapOptions/ColorPicker';
import Map from '../Map';
import MapLayers from './MapLayers';
import MapOptions from './MapOptions';

function MapVizzard({ mapConfig }) {
  const [layers, setLayers] = useState(mapConfig.layers);
  const [mapOptions, setMapOptions] = useState(mapConfig.mapOptions);
  const [activeLayer, setActiveLayer] = useState(null);
  const [mapObj, setMapObj] = useState(null);

  return (
    <div className="">
      <div className={`${styles.container}`}>
        <div id="map_layers" className={`${styles.mapLayersContainer}`}>
          <MapLayers
            layers={layers}
            setLayers={setLayers}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
          />
        </div>
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
        <div id="map_panel" className={`${styles.mapPanel}`} style={{ fontFamily: mapOptions.fontStyle.fontFamily, color: rgba(mapOptions.fontStyle.color) }}>
          <Map
            layers={layers}
            height={mapOptions.height}
            width={mapOptions.width}
            fontStyle={mapOptions.fontStyle}
            center={mapOptions.center}
            zoom={mapOptions.zoom}
            minZoom={mapOptions.minZoom}
            maxZoom={mapOptions.maxZoom}
            showHeader={mapOptions.showHeader}
            mainTitle={mapOptions.mainTitle}
            subTitle={mapOptions.subTitle}
            showScale={mapOptions.showScale}
            scaleUnits={mapOptions.scaleUnits}
            scaleBar={mapOptions.scaleBar}
            scaleBarPosition={mapOptions.scaleBarPosition}
            enableMouseWheelZoom={mapOptions.enableMouseWheelZoom}
            enableDoubleClickZoom={mapOptions.enableDoubleClickZoom}
            enableZoomControls={mapOptions.enableZoomControls}
            zoomControlsPosition={mapOptions.zoomControlsPosition}
            setMapObj={setMapObj}
            showFooter={mapOptions.showFooter}
            sources={mapOptions.sources}
            showLogos={mapOptions.showLogos}
          />
        </div>
      </div>
    </div>
  );
}

export default MapVizzard;

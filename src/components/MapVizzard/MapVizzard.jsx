import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Map from '../Map';
import MapLayers from './MapLayers';
import MapOptions from './MapOptions';
import styles from './MapOptions/MapOptions.module.css';

function MapVizzard({ mapConfig }) {
  const [layers, setLayers] = useState(mapConfig.layers);
  const [mapOptions, setMapOptions] = useState(mapConfig.mapOptions);
  const [activeLayer, setActiveLayer] = useState(null);
  const [mapObj, setMapObj] = useState(null);

  return (
    <div className="">
      <div className="row flex-nowrap">
        <div id="map_layers" className="col-3">
          <MapLayers
            layers={layers}
            setLayers={setLayers}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
          />
        </div>
        <div className={`${styles.mapOptionsContainer} col`}>
          <MapOptions
            layers={layers}
            setLayers={setLayers}
            activeLayer={activeLayer}
            mapOptions={mapOptions}
            setMapOptions={setMapOptions}
            mapObj={mapObj}
          />
        </div>
        <div id="map_panel" className="col-7">
          <Map
            layers={layers}
            height={mapOptions.height}
            width={mapOptions.width}
            center={mapOptions.center}
            zoom={mapOptions.zoom}
            mainTitle={mapOptions.mainTitle}
            subTitle={mapOptions.subTitle}
            showScale={mapOptions.showScale}
            scaleUnits={mapOptions.scaleUnits}
            scaleBar={mapOptions.scaleBar}
            scaleBarPosition={mapOptions.scaleBarPosition}
            enableMouseWheelZoom={mapOptions.enableMouseWheelZoom}
            enableZoomControls={mapOptions.enableZoomControls}
            zoomControlsPosition={mapOptions.zoomControlsPosition}
            setMapObj={setMapObj}
          />
        </div>
      </div>
    </div>
  );
}

export default MapVizzard;

import React, { useState, useMemo } from 'react';
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { osm, vector, mask } from './Source';
import {
  TileLayer, VectorLayer, MapboxLayer, MaskLayer, SymbolLayer,
} from './Layers';
import OpenLayersMap from './OpenLayersMap';
import styles from './Map.module.css';

function Map({
  mapObj,
  setMapObj,
  layers,
  height,
  width,
  zoom,
  center,
  mainTitle,
  subTitle,
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableZoomControls,
  zoomControlsPosition,
}) {
  const [map, setMap] = useState(null);

  const renderLayers = useMemo(() => {
    const renderLayersArr = [];

    layers.forEach((d, i) => {
      if (d.type === 'symbol') {
        renderLayersArr[i] = d.visible > 0 && (
          <SymbolLayer
            map={map}
            key={`symbolLayer${d.id}`}
            source={d.data}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            symbol={d.symbol}
            data={d.data}
            showLabels={d.showLabels}
            labelColumn={d.labelColumn}
          />
        );
      }
      if (d.type === 'osm') {
        renderLayersArr[i] = d.visible > 0 && (
          <TileLayer
            map={map}
            key={`tileLayer${d.id}`}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type === 'polygon') {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
            map={map}
            key={`vectorLayer${d.id}`}
            source={vector({
              features: new GeoJSON().readFeatures(d.data, {
                featureProjection: get('EPSG:3857'),
              }),
            })}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            showLabels={d.showLabels}
            labelColumn={d.labelColumn}
            declutter
          />
        );
      }
      if (d.type === 'mapbox') {
        renderLayersArr[i] = d.visible > 0 && (
          <MapboxLayer
            map={map}
            key={`mapboxLayer${d.id}`}
            zIndex={d.zIndex}
            opacity={d.opacity}
            styleUrl={d.style}
            accessToken={d.accessToken}
          />
        );
      }
      if (d.type === 'mask') {
        renderLayersArr[i] = d.visible > 0 && (
          <MaskLayer
            map={map}
            key={`maskLayer${d.id}`}
            id={d.id}
            source={mask()}
            polygon={d.mask}
            zIndex={d.zIndex}
            opacity={d.opacity}
            blur={d.blur}
          />
        );
      }
    });
    return renderLayersArr;
  }, [map, layers]);

  const mapContext = (
    <div
      className={styles.mapContainer}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <div className={styles.mapTitle}>
        <div className={styles.mainTitle}>{mainTitle}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
      <OpenLayersMap
        map={map}
        mapObj={mapObj}
        setMapObj={setMapObj}
        center={fromLonLat([center.lon, center.lat])}
        zoom={zoom}
        setMap={setMap}
        showScale={showScale}
        scaleUnits={scaleUnits}
        scaleBar={scaleBar}
        scaleBarPosition={scaleBarPosition}
        enableMouseWheelZoom={enableMouseWheelZoom}
        enableZoomControls={enableZoomControls}
        zoomControlsPosition={zoomControlsPosition}
      >
        {renderLayers}
      </OpenLayersMap>
    </div>
  );
  // });

  return mapContext;
}

export default Map;

Map.defaultProps = {
  zoom: 5,
  mainTitle: 'Main title',
  subTitle: 'Sub-title',
  center: { lon: 30.21, lat: 15.86 },
  height: 400,
  width: 700,
  children: null,
};

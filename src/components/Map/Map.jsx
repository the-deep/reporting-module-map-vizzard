import React, {
  useState, useMemo, useContext, useEffect,
} from 'react';
import {
  Style, Icon, Fill, Stroke, Circle, Image,
} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { osm, vector, mask } from './Source';
import {
  TileLayer, VectorLayer, MapboxLayer, MaskLayer,
} from './Layers';
import 'bootstrap/dist/css/bootstrap.css';
import { addCircles, addSymbols } from './Layers/SymbolLayer';
import MapContext from './MapContext';
import OpenLayersMap from './OpenLayersMap';
import styles from './Map.module.css';

function Map({
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
  const [renderLayers, setRenderLayers] = useState([]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const renderLayersArr = [];

    layers.forEach((d, i) => {
      if (d.type == 'symbol') {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
            key={`symbolLayer${d.id}`}
            source={vector({ features: addSymbols(d) })}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == 'osm') {
        renderLayersArr[i] = d.visible > 0 && (
          <TileLayer
            key={`tileLayer${d.id}`}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == 'polygon') {
        renderLayersArr[i] = d.visible > 0 && (
          <VectorLayer
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
      if (d.type == 'mapbox') {
        renderLayersArr[i] = d.visible > 0 && (
          <MapboxLayer
            key={`mapboxLayer${d.id}`}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if (d.type == 'mask') {
        renderLayersArr[i] = d.visible > 0 && (
          <MaskLayer
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
    setRenderLayers(renderLayersArr);
  }, [layers]);

  return (
    <MapContext.Provider value={{ map }}>
      <div
        className={styles.mapContainer}
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <div className={styles.mapTitle}>
          <div className={styles.mainTitle}>{mainTitle}</div>
          <div className={styles.subTitle}>{subTitle}</div>
        </div>
        <OpenLayersMap
          center={fromLonLat([center.lon, center.lat])}
          zoom={zoom}
          setMapObj={setMapObj}
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
    </MapContext.Provider>
  );
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

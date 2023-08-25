import React, { useState, useEffect, useMemo } from 'react';
import WebFont from 'webfontloader'; // eslint-disable-line import/no-extraneous-dependencies
import { fromLonLat, get } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import { osm, vector, mask } from './Source';
import {
  TileLayer, VectorLayer, MapboxLayer, MaskLayer, SymbolLayer,
} from './Layers';
import OpenLayersMap from './OpenLayersMap';
import './ol.css';
import styles from './Map.module.css';
import drc from './assets/logos/drc.jpg';
import dfs from './assets/logos/dfs.svg';
import immap from './assets/logos/immap.png';
import deep from './assets/logos/deep.svg';
import deepSmall from './assets/logos/deep_small.png';

function Map({
  mapObj,
  setMapObj,
  layers,
  height = 400,
  width = 700,
  fontStyle,
  zoom = 5,
  minZoom,
  maxZoom,
  center = { lon: 30.21, lat: 15.86 },
  showHeader,
  mainTitle = 'Main title',
  subTitle = 'Sub-title',
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableDoubleClickZoom,
  enableZoomControls,
  zoomControlsPosition,
  showFooter,
  sources,
  showLogos,
}) {
  const [map, setMap] = useState(null);
  const [fonts, setFonts] = useState(null);

  useEffect(() => {
    if (fonts) {
      WebFont.load({
        google: {
          families: fonts,
        },
      });
    }
  }, [fonts]);

  useEffect(() => {
    const usedFonts = [];
    layers.forEach((d) => {
      if (!d.style) return false;
      if ((typeof d.style.labelStyle === 'undefined') || (typeof d.style.labelStyle.fontFamily === 'undefined')) return false;
      const { fontFamily } = d.style.labelStyle;
      if (!usedFonts.includes(fontFamily)) {
        usedFonts.push(fontFamily);
      }
      return null;
    });
    if (!usedFonts.includes(fontStyle.fontFamily)) {
      usedFonts.push(fontStyle.fontFamily);
    }
    setFonts(usedFonts);
  }, [layers, fontStyle.fontFamily]);

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
            scale={d.scale}
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
            smoothing={d.smoothing}
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
      {showHeader && (
        <div>
          <div className={styles.mapTitle}>
            {showLogos && (
            <div className={styles.logos}>
              { showLogos.map((logo) => (
                <div key={logo} className={styles.headerLogo}>
                  { logo === 'Data Friendly Space' && <img className={styles.logoDfs} src={dfs} alt="" /> }
                  { logo === 'DEEP' && <img className={styles.logoDeep} src={deep} alt="" /> }
                  { logo === 'DEEP (small)' && <img className={styles.logoDeepSmall} src={deepSmall} alt="" /> }
                  { logo === 'DRC' && <img className={styles.logoDrc} src={drc} alt="" /> }
                  { logo === 'iMMAP' && <img className={styles.logoImmap} src={immap} alt="" /> }
                </div>
              ))}
            </div>
            )}
            <div className={styles.titleContainer}>
              <div className={styles.mainTitle}>{mainTitle}</div>
              <div className={styles.subTitle}>{subTitle}</div>
            </div>
          </div>
        </div>
      )}
      <OpenLayersMap
        map={map}
        mapObj={mapObj}
        setMapObj={setMapObj}
        center={fromLonLat([center.lon, center.lat])}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        setMap={setMap}
        showScale={showScale}
        scaleUnits={scaleUnits}
        scaleBar={scaleBar}
        scaleBarPosition={scaleBarPosition}
        enableMouseWheelZoom={enableMouseWheelZoom}
        enableDoubleClickZoom={enableDoubleClickZoom}
        enableZoomControls={enableZoomControls}
        zoomControlsPosition={zoomControlsPosition}
      >
        {renderLayers}
      </OpenLayersMap>
      {showFooter && (
        <div className={styles.mapFooter}>
          <b>Sources</b>
          <div className={styles.sources}>
            &nbsp;
            {sources}
          </div>
        </div>
      )}
    </div>
  );
  // });

  return mapContext;
}

export default Map;

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
import ColorScale from '../MapVizzard/MapOptions/ColorScale';
import { rgba } from '../MapVizzard/MapOptions/ColorPicker';
import styles from './Map.module.css';
import drc from './assets/logos/drc.jpg';
import dfs from './assets/logos/dfs.svg';
import immap from './assets/logos/immap.png';
import deep from './assets/logos/deep.svg';
import deepSmall from './assets/logos/deep_small.png';
import capital from './assets/map-icons/capital.svg';
import city from './assets/map-icons/city.svg';
import settlement from './assets/map-icons/settlement.svg';
import marker from './assets/map-icons/marker.svg';
import airport from './assets/map-icons/airport.svg';
import borderCrossing from './assets/map-icons/borderCrossing.svg';
import triangle from './assets/map-icons/triangle.svg';
import idpRefugeeCamp from './assets/map-icons/idp-refugee-camp.svg';

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
  showLegend,
  legendPosition,
  showFooter,
  sources,
  showLogos,
}) {
  const [map, setMap] = useState(null);
  const [fonts, setFonts] = useState(null);

  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
    borderCrossing,
    triangle,
  };

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

  const legendRows = useMemo(() => {
    const legendArr = [];

    layers.forEach((d) => {
      if (d.type === 'symbol') {
        const row = d.visible > 0 && d.showInLegend > 0 && (
          <div key={`legendSymbol${d.id}`}>
            <div className={styles.legendSymbol}>
              <img src={symbolIcons[d.symbol]} alt={d.symbol} style={{ transform: `scale(${d.scale})` }} />
            </div>
            <div className={styles.legendSeriesTitle}>
              {d.legendSeriesTitle}
            </div>
          </div>
        );
        legendArr.push(row);
      }
      if (d.type === 'polygon') {
        let legendPolygonRow;
        if (d.style.fillType === 'single') {
          legendPolygonRow = (
            <div
              className={styles.legendPolygonSingle}
              style={{
                backgroundColor: rgba(d.style.fill),
                borderWidth: d.style.strokeWidth,
                borderColor: rgba(d.style.stroke),
              }}
            />
          );
          const row = d.visible > 0 && d.showInLegend > 0 && (
            <div key={`legendSymbol${d.id}`}>
              <div style={{ opacity: d.opacity, display: 'inline' }}>
                {legendPolygonRow}
              </div>
              <div className={styles.legendSeriesTitle}>
                {d.legendSeriesTitle}
              </div>
            </div>
          );
          legendArr.push(row);
        }
        if (d.style.fillType === 'graduated') {
          legendPolygonRow = (
            <div>
              <div className={styles.legendPolygonGraduated} style={{ opacity: d.opacity }}>
                <ColorScale
                  colorScale={d.style.fillPalette}
                  steps={d.style.fillSteps}
                  colorScaleType={d.style.fillScaleType}
                  pow={d.style.fillPow}
                  containerClass="colorScaleDiv"
                  inverted={d.style.fillScaleInvert}
                />
              </div>
              <div className={styles.legendPolygonScaleUnits}>
                <div className={styles.legendPolygonScaleUnit1}>
                  {d.style.fillDataMin}
                </div>
                <div className={styles.legendPolygonScaleUnit2}>
                  {d.style.fillDataMax}
                </div>
              </div>
            </div>

          );
          const row = d.visible > 0 && d.showInLegend > 0 && (
            <div key={`legendPolygon${d.id}`}>
              <div className={styles.legendSeriesTitle}>
                <b style={{ fontSize: 10 }}>{d.legendSeriesTitle}</b>
              </div>
              {legendPolygonRow}
            </div>
          );
          legendArr.push(row);
        }
      }
    });
    return legendArr;
  }, [layers]);

  const bottomPos = useMemo(() => {
    let bottom = 10;
    if (legendPosition === 'bottomLeft') {
      if (showFooter === true) {
        bottom = 30;
        return { bottom: 30, left: 10 };
      }
    }
    if (legendPosition === 'topLeft') {
      if (showHeader === true) {
        return { top: 60, left: 10 };
      }
      return { top: 10, left: 10 };
    }
    if (legendPosition === 'topRight') {
      if ((enableZoomControls === true) && (zoomControlsPosition === 'topRight')) {
        return { top: 60, right: 10 };
      }
      return { top: 10, right: 10 };
    }
    if (legendPosition === 'bottomRight') {
      if ((showScale === true) && (scaleBarPosition === 'bottomRight')) {
        return { bottom: 35, right: 10 };
      }
      return { bottom: 10, right: 10 };
    }
    return { bottom, left: 10 };
  }, [
    showHeader,
    enableZoomControls,
    zoomControlsPosition,
    showScale,
    scaleBarPosition,
    showFooter,
    showLegend,
    legendPosition,
    showScale,
  ]);

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

      {showLegend && (
        <div className={styles.mapLegend} style={bottomPos}>
          <div className={styles.mapLegendTitle}>Legend</div>
          <div className={styles.legendRow}>
            {legendRows}
          </div>
        </div>
      )}

    </div>
  );
  // });

  return mapContext;
}

export default Map;

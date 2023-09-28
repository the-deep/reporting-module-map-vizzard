import React, { useState, useEffect, useMemo } from 'react';
import WebFont from 'webfontloader'; // eslint-disable-line import/no-extraneous-dependencies
import { fromLonLat, get } from 'ol/proj';
import * as d3 from 'd3';
import GeoJSON from 'ol/format/GeoJSON';
import { breaks } from 'statsbreaks';
import { osm, vector, mask } from './Source';
import {
  TileLayer, VectorLayer, LineLayer, MapboxLayer, MaskLayer, SymbolLayer,
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

function bucketsFn(rangeLow, rangeHigh, wanted) {
  const increment = Math.floor((rangeHigh - rangeLow) / (wanted - 1));
  const r = [rangeLow];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < wanted - 1; ++i) {
    r.push(i * increment + rangeLow);
  }
  r.push(rangeHigh);
  return r;
}

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
  embed = false,
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
            scaleType={d.scaleType}
            scaleScaling={d.scaleScaling}
            scaleColumn={d.scaleColumn}
            scaleDataMin={d.scaleDataMin}
            scaleDataMax={d.scaleDataMax}
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
      if (d.type === 'line') {
        renderLayersArr[i] = d.visible > 0 && (
          <LineLayer
            map={map}
            key={`lineLayer${d.id}`}
            source={vector({
              features: new GeoJSON().readFeatures(d.data, {
                featureProjection: get('EPSG:3857'),
              }),
            })}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
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
        if (d.symbol === 'circle') {
          if (d.scaleType === 'fixed') {
            let r = 6 * d.scale;
            if (d.scale > 1) r = 6;
            const row = d.visible > 0 && d.showInLegend > 0 && (
              <div key={`legendSymbol${d.id}`}>
                <div className={styles.legendSymbol}>
                  <div>
                    <svg width="40" height="20">
                      <circle
                        cx="7.5"
                        cy="7"
                        r={r}
                        style={{
                          fill: rgba(d.style.fill),
                          strokeWidth: d.style.strokeWidth,
                          stroke: rgba(d.style.stroke),
                          opacity: d.opacity,
                        }}
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.legendSeriesTitle} style={{ verticalAlign: 'top' }}>
                  {d.legendSeriesTitle}
                </div>
              </div>
            );
            legendArr.push(row);
          } else { // proportional symbol legend
            const bv = bucketsFn(0, d.scaleDataMax, 20);
            const numBuckets = 6;
            const buckets = breaks(bv, {
              method: 'pretty', nb: numBuckets, minmax: false, precision: 0,
            });
            let exp = 0.5;
            if (d.scaleScaling === 'flannery') {
              exp = 0.5716;
            }
            const maxRadius = ((d3.max(buckets) / d.scaleDataMax) / 3.14) ** exp * (10 * d.scale);
            if ((d.scale < 3)) {
              buckets.splice(1, 1);
              if (buckets.length > 2) {
                buckets.splice(1, 1);
              }
            }

            if (buckets.length > 3) {
              buckets.splice(2, 1);
            }

            const legendRowHeight = (maxRadius * 2) + 5;

            const circles = buckets.map((b) => {
              const radius = ((b / d.scaleDataMax) / 3.14) ** exp * (10 * d.scale);

              return (
                <g key={`legendSymbolCircle${b}`}>
                  <circle
                    cx={(maxRadius) + 2}
                    cy={radius + 3}
                    r={radius}
                    clipPath="url(#cut-off)"
                    style={{
                      fill: rgba(d.style.fill),
                      strokeWidth: d.style.strokeWidth,
                      stroke: rgba(d.style.stroke),
                      opacity: d.opacity,
                    }}
                  />
                  <text
                    x={(maxRadius) + 11}
                    y={radius + (radius) + 5}
                    style={{ textAnchor: 'left', fontSize: 7, fill: 'rgb(49 49 49)' }}
                  >
                    {b}
                  </text>
                  <line
                    x1={(maxRadius)}
                    x2={(maxRadius) + 10}
                    y1={radius * 2 + 3}
                    y2={radius * 2 + 3}
                    stroke="grey"
                    strokeWidth={0.4}
                    strokeDasharray="1,1"
                  />
                </g>
              );
            });

            const row = d.visible > 0 && d.showInLegend > 0 && (
              <div key={`legendSymbol${d.id}`}>
                <div className={styles.legendSeriesTitle}>
                  <b style={{ fontSize: 10 }}>{d.legendSeriesTitle}</b>
                </div>
                <div className={styles.legendSymbolProportional}>
                  <div>
                    <svg width="120" height={legendRowHeight + 3}>
                      <clipPath id="cut-off">
                        <rect x="0" y="0" width={legendRowHeight / 2} height={legendRowHeight} />
                      </clipPath>
                      {circles}
                    </svg>
                  </div>
                </div>
              </div>
            );
            legendArr.push(row);
          }
        } else {
          let scaleTransform = d.scale;
          if (d.scale > 0.85) scaleTransform = 0.85;
          const row = d.visible > 0 && d.showInLegend > 0 && (
            <div key={`legendSymbol${d.id}`}>
              <div className={styles.legendSymbol}>
                <img src={symbolIcons[d.symbol]} alt={d.symbol} style={{ transform: `scale(${scaleTransform})`, opacity: d.opacity }} />
              </div>
              <div className={styles.legendSeriesTitle}>
                {d.legendSeriesTitle}
              </div>
            </div>
          );
          legendArr.push(row);
        }
      }
      if (d.type === 'polygon') {
        let legendPolygonRow;
        if (d.style.fillType === 'single') {
          if (d.style.fillSingleType === 'solid') {
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
          }
          if (d.style.fillSingleType === 'pattern') {
            legendPolygonRow = (
              <div
                className={styles.legendPolygonSingle}
                style={{
                  background: `repeating-linear-gradient(${90 + d.style.fillPatternAngle}deg, transparent, transparent ${d.style.fillPatternSpacing / 1.5}px, ${rgba(d.style.fill)} ${d.style.fillPatternSpacing / 1.5}px, ${rgba(d.style.fill)} ${(d.style.fillPatternSize + d.style.fillPatternSpacing / 1.5)}px)`,
                  borderWidth: d.style.strokeWidth,
                  borderColor: rgba(d.style.stroke),
                }}
              />
            );
          }
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

  let w = `${width}px`;
  if (embed) w = '100%';

  const mapContext = (
    <div
      className={`${styles.mapContainer} ${(embed ? styles.embedMap : '')}`}
      style={{ height: `${height}px`, width: w }}
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

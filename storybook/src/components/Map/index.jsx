import {
  useId,
  useState,
  useEffect,
  useMemo,
} from 'react';
import WebFont from 'webfontloader'; // eslint-disable-line
import { fromLonLat, get } from 'ol/proj';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import { d3max } from 'd3';
import GeoJSON from 'ol/format/GeoJSON';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { breaks } from 'statsbreaks';

import './ol.css';
import styles from './styles.module.css';
import {
  osm,
  vector,
  mask,
  numberFormatter,
  rgba,
} from './helpers';
import TileLayer from './Layers/TileLayer';
import VectorLayer from './Layers/VectorLayer';
import LineLayer from './Layers/LineLayer';
import MapboxLayer from './Layers/MapboxLayer';
import MaskLayer from './Layers/MaskLayer';
import SymbolLayer from './Layers/SymbolLayer';
import HeatmapLayer from './Layers/HeatmapLayer';
import HexbinLayer from './Layers/HexbinLayer';
import OlMap from './OlMap';
import ColorScale from '../ColorScale';

import cdcf from './assets/logos/cdcf.jpg';
import drc from './assets/logos/drc.jpg';
import dfs from './assets/logos/dfs.svg';
import immap from './assets/logos/immap.png';
import unocha from './assets/logos/unocha.png';
import deep from './assets/logos/deep.svg';
import deepSmall from './assets/logos/deep_small.png';
import capital from './assets/map-icons/capital.svg';
import city from './assets/map-icons/city.svg';
import settlement from './assets/map-icons/settlement.svg';
import marker from './assets/map-icons/marker.svg';
import airport from './assets/map-icons/airport.svg';
import borderCrossing from './assets/map-icons/borderCrossing.svg';
import borderCrossingActive from './assets/map-icons/borderCrossingActive.svg';
import borderCrossingPotential from './assets/map-icons/borderCrossingPotential.svg';
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
  showOverview = false,
  overviewMapPosition = 'bottomRight',
  headerStyle = 'default',
  mainTitle = 'Main title',
  subTitle = 'Sub-title',
  dateText = 'dateText',
  primaryColor = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  },
  showScale,
  scaleUnits,
  scaleBar,
  scaleBarPosition,
  enableMouseWheelZoom,
  enableDragPan,
  enableDoubleClickZoom,
  enableZoomControls,
  zoomControlsPosition,
  showLegend,
  legendPosition,
  showFooter,
  sources,
  showLogos,
  dashboard = false,
  print = false,
  embed = false,
  legendTopPadding = 0,
  paddingBottom = 0,
}) {
  const [map, setMap] = useState(null);
  const [fonts, setFonts] = useState(null);
  // const printSVGId = useId();
  const printPNGId = useId();
  const mapId = useId();

  let sourcesPadding = {};

  if (paddingBottom > 0) {
    sourcesPadding = { position: 'relative', bottom: (paddingBottom + 22) };
  }
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
    borderCrossing,
    borderCrossingActive,
    borderCrossingPotential,
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
  }, [fonts, mapId]);

  useEffect(() => {
    if (!map) return undefined;
    const element = document.getElementById(mapId);
    const scale = 2;

    // function printSVG() {
    //   htmlToImage.toSvg(element, {
    //     quality: 0.95,
    //     cacheBust: false,
    //     height: ((element.clientHeight * scale) + 1),
    //     width: (element.clientWidth * scale),
    //     style: { transform: `scale(${scale})`, transformOrigin: 'top left' },
    //   })
    //     .then((dataUrl) => {
    //       const link = document.createElement('a');
    //       link.download = 'export-map.svg';
    //       link.href = dataUrl;
    //       link.click();
    //     });
    // }

    function printPNG() {
      toPng(element, {
        quality: 1,
        // preferredFontFormat: 'embedded-opentype',
        cacheBust: false,
        height: ((element.clientHeight * scale) + 1),
        width: (element.clientWidth * scale),
        style: { transform: `scale(${scale})`, transformOrigin: 'top left' },
      })
        .then((dataUrl) => {
          saveAs(dataUrl, 'export-map.png');
        });
    }
    if (!embed) {
      // document.getElementById(printSVGId).addEventListener('click', printSVG);
      document.getElementById(printPNGId).addEventListener('click', printPNG);
    }

    return () => {
      if (map) {
        // document.getElementById(printSVG).removeEventListener('click', printSVG);
        // document.getElementById(printPNG).removeEventListener('click', printPNG);
      }
    };
  }, [map]);

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
    const renderLayersArr = layers.map((d) => {
      if ((d.type === 'symbol') && (d.visible > 0)) {
        return (
          <SymbolLayer
            map={map}
            key={`symbolLayer${d.id}`}
            layerId={`symbolLayer${d.id}`}
            source={d.data}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            primaryColor={rgba(primaryColor)}
            symbol={d.symbol}
            scale={d.scale}
            data={d.data}
            showLabels={d.showLabels}
            labelStyle={d.labelStyle}
            scaleType={d.scaleType}
            scaleScaling={d.scaleScaling}
            scaleColumn={d.scaleColumn}
            scaleDataMin={d.scaleDataMin}
            scaleDataMax={d.scaleDataMax}
            labelColumn={d.labelColumn}
            enableTooltips={d.enableTooltips}
            tooltipsTitleColumn={d.tooltipsTitleColumn}
            tooltipsValueColumn={d.tooltipsValueColumn}
            tooltipsValueLabel={d.tooltipsValueLabel}
          />
        );
      }
      if ((d.type === 'heatmap') && (d.visible > 0)) {
        return (
          <HeatmapLayer
            map={map}
            key={`symbolLayer${d.id}`}
            source={d.data}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            scale={d.scale}
            data={d.data}
            scaleColumn={d.scaleColumn}
            scaleDataMin={d.scaleDataMin}
            scaleDataMax={d.scaleDataMax}
            blur={d.blur}
            radius={d.radius}
            fillPalette={d.fillPalette}
            weighted={d.weighted}
          />
        );
      }
      if ((d.type === 'hexbin') && (d.visible > 0)) {
        return (
          <HexbinLayer
            map={map}
            key={`symbolLayer${d.id}`}
            source={d.data}
            zIndex={d.zIndex}
            opacity={d.opacity}
            style={d.style}
            scale={d.scale}
            data={d.data}
            scaleColumn={d.scaleColumn}
            scaleDataMin={d.scaleDataMin}
            scaleDataMax={d.scaleDataMax}
            blur={d.blur}
            radius={d.radius}
            fillPalette={d.fillPalette}
            weighted={d.weighted}
          />
        );
      }
      if ((d.type === 'osm') && (d.visible > 0)) {
        return (
          <TileLayer
            map={map}
            key={`tileLayer${d.id}`}
            source={osm()}
            zIndex={d.zIndex}
            opacity={d.opacity}
          />
        );
      }
      if ((d.type === 'polygon') && (d.visible > 0)) {
        return (
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
      if ((d.type === 'line') && (d.visible > 0)) {
        return (
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
      if ((d.type === 'mapbox') && (d.visible > 0)) {
        return (
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
      if ((d.type === 'mask') && (d.visible > 0)) {
        return (
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
      return undefined;
    });
    return renderLayersArr;
  }, [map, JSON.stringify(layers)]);

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
                  <div className="legendCircles">
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
            const maxRadius = ((d3max(buckets) / d.scaleDataMax) / 3.14) ** exp * (10 * d.scale);
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
                    {numberFormatter(b)}
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
            let filterStyle = {};
            if (d.legendSeriesTitle === 'Sudanese refugees and IDPs') filterStyle = { filter: 'saturate(0%)' };
            const row = d.visible > 0 && d.showInLegend > 0 && (
              <div key={`legendSymbol${d.id}`}>
                <div className={styles.legendSeriesTitle}>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>{d.legendSeriesTitle}</span>
                </div>
                <div className={styles.legendSymbolProportional} style={filterStyle}>
                  <div id="legendCircles" className={styles.legendCircles}>
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
                  {numberFormatter(d.style.fillDataMax)}
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
      if (d.type === 'heatmap') {
        const legendHeatmapRow = (
          <div>
            <div
              className={styles.legendPolygonGraduated}
              style={{ opacity: d.opacity, height: 10 }}
            >
              <ColorScale
                colorScale={d.fillPalette}
                steps={5}
                colorScaleType={d.style.fillScaleType}
                pow={d.style.fillPow}
                containerClass="colorScaleDiv"
                inverted={d.style.fillScaleInvert}
              />
            </div>
          </div>
        );
        const row = d.visible > 0 && d.showInLegend > 0 && (
          <div key={`legendPolygon${d.id}`}>
            <div className={styles.legendSeriesTitle}>
              <b style={{ fontSize: 10 }}>{d.legendSeriesTitle}</b>
            </div>
            {legendHeatmapRow}
          </div>
        );
        legendArr.push(row);
      }
      if (d.type === 'hexbin') {
        const legendHexbinRow = (
          <div>
            <div
              className={styles.legendPolygonGraduated}
              style={{ opacity: d.opacity, height: 10 }}
            >
              <ColorScale
                colorScale={d.fillPalette}
                steps={5}
                colorScaleType={d.style.fillScaleType}
                pow={d.style.fillPow}
                containerClass="colorScaleDiv"
                inverted={d.style.fillScaleInvert}
              />
            </div>
          </div>
        );
        const row = d.visible > 0 && d.showInLegend > 0 && (
          <div key={`legendPolygon${d.id}`}>
            <div className={styles.legendSeriesTitle}>
              <b style={{ fontSize: 10 }}>{d.legendSeriesTitle}</b>
            </div>
            {legendHexbinRow}
          </div>
        );
        legendArr.push(row);
      }
    });
    const legendArrFiltered = legendArr.filter(Boolean);
    return legendArrFiltered;
  }, [JSON.stringify(layers)]);

  const bottomPos = useMemo(() => {
    let bottom = 10;
    if (legendPosition === 'bottomLeft') {
      // if (showFooter === true) {
      bottom = 30;
      return { bottom: 30, left: 4 };
      // }
    }
    if (legendPosition === 'topLeft') {
      if (showHeader === true) {
        return { top: 60, left: 4 };
      }
      return { top: 10, left: 4 };
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
    showOverview,
  ]);

  let w = `${width}px`;
  if (embed) w = '100%';
  let dashboardStyle = {};
  let sourcesStyle = {};
  let h = height;
  const yOffset = 97 + paddingBottom;
  if ((height === '') || (height === 0)) h = `calc(100vh - ${yOffset}px)`;
  let paddingTop = 0;
  if (dashboard) paddingTop = 100;
  if (dashboard) dashboardStyle = { position: 'absolute', top: 0, width: '100%' };
  if (dashboard) {
    sourcesStyle = {
      textAlign: 'right',
      right: 10,
      bottom: 72,
      zIndex: 99999,
    };
  }
  if ((dashboard) && (print)) {
    sourcesStyle = {
      textAlign: 'left',
      right: 10,
      bottom: 72,
      zIndex: 99999,
    };
  }
  const mapContext = (
    <div>
      <div>
        <div
          id={mapId}
          className={`${styles.mapContainer} ${(embed ? styles.embedMap : '')} ${(headerStyle === 'iMMAP' ? styles.headeriMMAP : '')}`}
          style={{
            ...dashboardStyle,
            minHeight: height,
            width: w,
            fontFamily: fontStyle.fontFamily,
          }}
        >
          {showHeader && (
            <div className={styles.header}>
              <div className={styles.mapTitle} style={(headerStyle === 'iMMAP' ? { backgroundColor: '#FFF' } : {})}>
                {showLogos && (
                <div className={styles.logos} style={(enableZoomControls && zoomControlsPosition === 'topRight' && headerStyle !== 'iMMAP') ? { marginRight: 0, marginTop: 6 } : {}}>
                  { showLogos.map((logo) => (
                    <div key={logo} className={styles.headerLogo}>
                      { logo === 'CDCF' && <img className={styles.logoCDCF} src={cdcf} alt="" /> }
                      { logo === 'Data Friendly Space' && <img className={styles.logoDfs} src={dfs} alt="" /> }
                      { logo === 'DEEP' && <img className={styles.logoDeep} src={deep} alt="" /> }
                      { logo === 'DEEP (small)' && <img className={styles.logoDeepSmall} src={deepSmall} alt="" /> }
                      { logo === 'DRC' && <img className={styles.logoDrc} src={drc} alt="" /> }
                      { logo === 'iMMAP' && (
                        <div>
                          <img className={styles.logoImmap} src={immap} alt="" />
                          { showLogos.length > 1 && (
                            <div className={styles.logoImmapBorder}>&nbsp;</div>
                          )}
                        </div>
                      )}
                      { logo === 'UNOCHA' && <img className={styles.logoUnocha} src={unocha} alt="" /> }
                    </div>
                  ))}
                </div>
                )}
                <div className={styles.titleContainer}>
                  <div
                    className={styles.mainTitle}
                    style={{ color: rgba(primaryColor) }}
                  >
                    {mainTitle}
                  </div>
                  <div className={styles.subTitle}>{subTitle}</div>
                </div>
                <div className={styles.dateText} style={(enableZoomControls && zoomControlsPosition === 'topRight') ? { marginRight: 34 } : {}}>{dateText}</div>
              </div>
              {headerStyle === 'iMMAP' && (
                <div className={styles.immapHeaderBar}>
                  <div className={styles.immapHeaderBar1} />
                  <div className={styles.immapHeaderBar2} />
                </div>
              )}
            </div>
          )}
          <div
            className={dashboard ? styles.dashboard : ''}
            style={{
              height: h,
              position: 'relative',
              paddingTop,
              marginBottom: paddingBottom,
            }}
          >
            <OlMap
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
              enableDragPan={enableDragPan}
              enableMouseWheelZoom={enableMouseWheelZoom}
              enableDoubleClickZoom={enableDoubleClickZoom}
              enableZoomControls={enableZoomControls}
              zoomControlsPosition={zoomControlsPosition}
              showOverview={showOverview}
              overviewMapPosition={overviewMapPosition}
              paddingBottom={paddingBottom}
            >
              {renderLayers}
            </OlMap>

            {showLegend && (
            <div className={styles.mapLegend} style={{ ...bottomPos, top: legendTopPadding }}>
              <div className={styles.mapLegendTitle}>Legend</div>
              <div className={styles.legendRow}>
                {legendRows}
              </div>
            </div>
            )}
          </div>

          {/* {showFooter && ( */}
          <div style={{ ...sourcesPadding, ...sourcesStyle }} className={styles.mapFooter}>
            <b>Sources</b>
            <div className={styles.sources}>
              &nbsp;
              {sources}
            </div>
          </div>
          {/* )} */}

          {(headerStyle === 'iMMAP' && showFooter) && (
            <div className={styles.immapFooterBar}>
              <div className={styles.immapFooterColorBar}>
                <div className={styles.immapFooterBar1} />
                <div className={styles.immapFooterBar2} />
              </div>
              <div className={styles.immapStrapline}>
                Better Data | Better Decisions |&nbsp;
                <div className={styles.immapStrapLine2}>Better Outcomes</div>
              </div>
              <div className={styles.disclaimer}>
                The boundaries, names, and designations used in this map
                do not imply official endorsement or acceptance by iMMAP
              </div>
            </div>
          )}
        </div>
      </div>
      {!embed && (
        <div className={styles.exportButtons} style={{}}>
          {/*
          <Button
            id={printSVGId}
            size="small"
            theme={theme}
            variant="outlined">
            Export to SVG
          </Button>
          &nbsp;
          */}
          <Button id={printPNGId} size="small" theme={theme} variant="outlined">Export to PNG</Button>
        </div>
      )}
    </div>
  );
  // });

  return mapContext;
}

export default Map;

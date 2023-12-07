import React, { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import {
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  FormControl,
} from '@mui/material';
import FontPicker from './FontPicker';
import ColorPicker from './ColorPicker';
import styles from './MapOptions.module.css';
import point from '../assets/point.svg';
import capital from '../../Map/assets/map-icons/capital.svg';
import city from '../../Map/assets/map-icons/city.svg';
import settlement from '../../Map/assets/map-icons/settlement.svg';
import marker from '../../Map/assets/map-icons/marker.svg';
import airport from '../../Map/assets/map-icons/airport.svg';
import borderCrossing from '../../Map/assets/map-icons/borderCrossing.svg';
import borderCrossingActive from '../../Map/assets/map-icons/borderCrossingActive.svg';
import borderCrossingPotential from '../../Map/assets/map-icons/borderCrossingPotential.svg';
import triangle from '../../Map/assets/map-icons/triangle.svg';
import idpRefugeeCamp from '../../Map/assets/map-icons/idp-refugee-camp.svg';
import nullType from '../assets/nullType.svg';
import string from '../assets/string.svg';
import number from '../assets/number.svg';
import date from '../assets/date.svg';
import coordinates from '../assets/coordinates.svg';

function isValidDate(dateString) {
  const dt = new Date(dateString);
  // eslint-disable-next-line
  return dt instanceof Date && !isNaN(dt);
}

const columnDataTypeIcons = {
  nullType,
  string,
  number,
  date,
  coordinates,
};

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
  circle: 'circle',
};

function OptionsSymbol({ layer, activeLayer, updateLayer }) {
  const symbols = Object.keys(symbolIcons);

  const columns = useMemo(() => {
    const types = {};
    let obj = layer.data;
    if (!Array.isArray(layer.data)) obj = layer.data.features;

    Object.entries(obj).forEach((feature) => {
      let f = feature[1];
      if (!Array.isArray(layer.data)) {
        f = feature[1].properties;
      }
      Object.entries(f).forEach((property) => {
        const [key, value] = property;
        let type = typeof value;
        if (type === 'string') {
          if (isValidDate(value)) type = 'date';
        }
        if (value === '') type = 'nullType';
        if ((key === 'lat') || (key === 'lon') || (key === 'Lat') || (key === 'Lon') || (key === 'LAT') || (key === 'LON') || (key === 'LATITUDE') || (key === 'LONGITUDE') || (key === 'latitude') || (key === 'longitude')) {
          type = 'coordinates';
        }
        // remove null columns
        if (type !== 'nullType') types[key] = type;
      });
    });
    return types;
  }, [layer.data]);

  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const updateAttr = (attr, val) => {
    const layerClone = { ...layer };
    layerClone[attr] = val;
    updateLayer(layerClone, activeLayer);
  };

  const updateStyle = (attr, val) => {
    const layerClone = { ...layer };
    layerClone.style[attr] = val;
    updateLayer(layerClone, activeLayer);
  };

  const updateFontStyle = (attr, val) => {
    const layerClone = { ...layer };
    layerClone.style.labelStyle[attr] = val;
    updateLayer(layerClone, activeLayer);
  };

  const setFill = (d) => {
    updateStyle('fill', d);
  };

  const setStroke = (d) => {
    updateStyle('stroke', d);
  };

  useEffect(() => {
    let max;
    let min;
    if (!Array.isArray(layer.data)) {
      max = d3.max(layer.data.features, (d) => d.properties[layer.scaleColumn]);
      min = d3.min(layer.data.features, (d) => d.properties[layer.scaleColumn]);
    } else {
      max = d3.max(layer.data, (d) => d[layer.scaleColumn]);
      min = d3.min(layer.data, (d) => d[layer.scaleColumn]);
    }

    // automatic min/max data extent. TODO make option to override automatically calucated values
    updateAttr('scaleDataMin', min);
    updateAttr('scaleDataMax', max);
  }, [layer.scaleColumn]);

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={point} alt="" />
          </div>
          Symbol Options
        </h1>
      </div>
      <div className={styles.mapOptionsPanelBody}>
        <div className={styles.optionsPanel}>
          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Layer name"
                variant="standard"
                value={layer.name}
                onChange={(e) => updateAttr('name', e.target.value)}
              />
            </FormControl>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Opacity</div>
            <Slider
              aria-label="Opacity"
              value={layer.opacity}
              size="small"
              onChange={(e, val) => updateAttr('opacity', val)}
              valueLabelDisplay="auto"
              step={0.01}
              color="primary"
              theme={theme}
              min={0}
              max={1}
            />
          </div>

          <hr />

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <InputLabel id="symbol-select-label">Symbol</InputLabel>
              <Select
                labelId="symbol-select-label"
                id="symbol-select"
                style={{ backgroundColor: '#fff' }}
                value={layer.symbol}
                onChange={(e, val) => updateAttr('symbol', val.props.value)}
                label="Symbol"
                variant="outlined"
                size="small"
              >
                {symbols.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    <img
                      className={styles.mapSymbolSelectIcon}
                      src={symbolIcons[symbol]}
                      alt=""
                    />
                    &nbsp;
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Fill color</div>
            <div className={styles.optionValue}>
              <ColorPicker color={layer.style.fill} setColor={setFill} />
            </div>
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Stroke color</div>
            <div className={styles.optionValue}>
              <ColorPicker color={layer.style.stroke} setColor={setStroke} />
            </div>
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Stroke width</div>
            <Slider
              aria-label="Stroke width"
              value={layer.style.strokeWidth}
              size="small"
              onChange={(e, val) => updateStyle('strokeWidth', val)}
              valueLabelDisplay="auto"
              step={0.1}
              color="primary"
              theme={theme}
              min={0.1}
              max={5}
            />
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Scale type</div>
            <div className={styles.optionValue}>
              <ToggleButtonGroup
                fullWidth
                value={layer.scaleType}
                color="primary"
                exclusive
                size="small"
                onChange={(e, val) => updateAttr('scaleType', val)}
                aria-label="Scale type"
              >
                <ToggleButton value="fixed">Fixed size</ToggleButton>
                <ToggleButton value="proportional">Proportional</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {layer.scaleType === 'fixed' && (

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Symbol size</div>
            <Slider
              aria-label="Opacity"
              value={layer.scale}
              size="small"
              onChange={(e, val) => updateAttr('scale', val)}
              valueLabelDisplay="auto"
              step={0.01}
              color="primary"
              theme={theme}
              min={0}
              max={5}
            />
          </div>

          )}

          {layer.scaleType === 'proportional' && (
          <div>
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>Data column</div>
              <div className={styles.optionValue}>
                <FormControl fullWidth size="small">
                  <Select
                    labelId="text-column-label"
                    id="text-column"
                    value={layer.scaleColumn}
                    onChange={(e, val) => updateAttr('scaleColumn', val.props.value)}
                    size="small"
                    style={{ backgroundColor: '#fff', fontSize: 12 }}
                    variant="standard"
                  >
                    {Object.keys(columns)
                      .sort()
                      .map((labelColumn) => (
                        <MenuItem key={`textLabelColumn-${labelColumn}`} value={labelColumn}>
                          <img
                            className={styles.columnDataTypeIcon}
                            src={columnDataTypeIcons[columns[labelColumn]]}
                            alt={labelColumn}
                          />
                          {labelColumn}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className={styles.optionRow}>
              <Box display="flex">
                <FormControl>
                  <TextField
                    label="Minimum"
                    variant="standard"
                    value={layer.scaleDataMin || 0}
                    type="number"
                    disabled
                    size="small"
                  />
                </FormControl>
                &nbsp; &nbsp; &nbsp;
                <FormControl>
                  <TextField
                    label="Maximum"
                    variant="standard"
                    value={layer.scaleDataMax || 0}
                    type="number"
                    disabled
                    size="small"
                  />
                </FormControl>
              </Box>
            </div>
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Symbol size</div>
                <Slider
                  aria-label="Opacity"
                  value={layer.scale}
                  size="small"
                  onChange={(e, val) => updateAttr('scale', val)}
                  valueLabelDisplay="auto"
                  step={0.01}
                  color="primary"
                  theme={theme}
                  min={0}
                  max={5}
                />
              </div>
            </div>
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>Scaling method</div>
              <div className={styles.optionValue}>
                <ToggleButtonGroup
                  fullWidth
                  value={layer.scaleScaling}
                  color="primary"
                  exclusive
                  size="small"
                  onChange={(e, val) => updateAttr('scaleScaling', val)}
                  aria-label="Scale method"
                >
                  <ToggleButton value="absolute">Absolute</ToggleButton>
                  <ToggleButton value="flannery">Flannery</ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
          )}

          <hr />

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show text labels
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={layer.showLabels}
                color="default"
                onChange={(e, val) => updateAttr('showLabels', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {layer.showLabels && (
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Text label column</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.labelColumn}
                      onChange={(e, val) => updateAttr('labelColumn', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      {Object.keys(columns)
                        .sort()
                        .map((labelColumn) => (
                          <MenuItem key={`textLabelColumn-${labelColumn}`} value={labelColumn}>
                            <img
                              className={styles.columnDataTypeIcon}
                              src={columnDataTypeIcons[columns[labelColumn]]}
                              alt={labelColumn}
                            />
                            {labelColumn}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <hr />

              <FontPicker style={layer.style.labelStyle} updateFontStyle={updateFontStyle} variant="symbol" />
            </div>
          )}

          <hr />

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show in legend
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={layer.showInLegend}
                color="default"
                onChange={(e, val) => updateAttr('showInLegend', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {layer.showInLegend && (
            <div className={styles.optionRow}>
              <FormControl fullWidth>
                <TextField
                  label="Layer name"
                  variant="standard"
                  value={layer.legendSeriesTitle}
                  onChange={(e) => updateAttr('legendSeriesTitle', e.target.value)}
                />
              </FormControl>
            </div>
          )}

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show tooltips
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={layer.enableTooltips}
                color="default"
                onChange={(e, val) => updateAttr('enableTooltips', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          {layer.enableTooltips && (
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Tooltip title column</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.tooltipsTitleColumn ?? ''}
                      onChange={(e, val) => updateAttr('tooltipsTitleColumn', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      <MenuItem key="texttooltipTitleColumn-empty" value="">&nbsp;</MenuItem>
                      {Object.keys(columns)
                        .sort()
                        .map((tt) => (
                          <MenuItem key={`texttooltipTitleColumn-${tt}`} value={tt}>
                            <img
                              className={styles.columnDataTypeIcon}
                              src={columnDataTypeIcons[columns[tt]]}
                              alt={tt}
                            />
                            {tt}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Tooltip value column</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.tooltipsValueColumn}
                      onChange={(e, val) => updateAttr('tooltipsValueColumn', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      <MenuItem key="texttooltipValueColumn-empty" value="">&nbsp;</MenuItem>
                      {Object.keys(columns)
                        .sort()
                        .map((tooltipValueColumn) => (
                          <MenuItem key={`texttooltipValueColumn-${tooltipValueColumn}`} value={tooltipValueColumn}>
                            <img
                              className={styles.columnDataTypeIcon}
                              src={columnDataTypeIcons[columns[tooltipValueColumn]]}
                              alt={tooltipValueColumn}
                            />
                            {tooltipValueColumn}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <hr />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OptionsSymbol;

import React, { useEffect, useMemo } from 'react';
import { d3max, d3min } from 'd3';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import { ToggleButton, ToggleButtonGroup, FormControl } from '@mui/material';
import FontPicker from './FontPicker';
import ColorPicker from './ColorPicker';
import ColorScale from '../../ColorScale';
import styles from './MapOptions.module.css';
import polygon from '../assets/polygon.svg';
import nullType from '../assets/nullType.svg';
import string from '../assets/string.svg';
import number from '../assets/number.svg';
import date from '../assets/date.svg';
import coordinates from '../assets/coordinates.svg';
import fillSolid from '../assets/fillSolid.svg';
import fillPattern from '../assets/fillPattern.svg';

function isValidDate(dateString) {
  const dt = new Date(dateString);
  // eslint-disable-next-line
  return dt instanceof Date && !isNaN(dt);
}

function OptionsVector({ layer, activeLayer, updateLayer }) {
  const columnDataTypeIcons = {
    nullType,
    string,
    number,
    date,
    coordinates,
  };

  const columns = useMemo(() => {
    const types = {};
    Object.entries(layer.data.features).forEach((feature) => {
      Object.entries(feature[1].properties).forEach((property) => {
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

  // materialUI theme
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
    const max = d3max(layer.data.features, (d) => d.properties[layer.style.fillColumn]);
    const min = d3min(layer.data.features, (d) => d.properties[layer.style.fillColumn]);
    // automatic min/max data extent. TODO make option to override automatically calucated values
    updateStyle('fillDataMin', min);
    updateStyle('fillDataMax', max);
  }, [layer.style.fillColumn]);

  const colorPalettes = [
    {
      category: 'Sequential (Single-Hue)',
      schemes: [
        'Blues',
        'Greens',
        'Greys',
        'Oranges',
        'Purples',
        'Reds',
      ],
    },
    {
      category: 'Sequential (Multi-Hue)',
      schemes: [
        'BuGn',
        'BuPu',
        'GnBu',
        'OrRd',
        'PuBuGn',
        'PuBu',
        'PuRd',
        'RdPu',
        'YlGnBu',
        'YlGn',
        'YlOrBr',
        'YlOrRd',
        'Cividis',
        'Viridis',
        'Inferno',
        'Magma',
        'Plasma',
        'Warm',
        'Cool',
        'CubehelixDefault',
      ],
    },
    {
      category: 'Diverging',
      schemes: [
        'BrBG',
        'PRGn',
        'PiYG',
        'PuOr',
        'RdBu',
        'RdGy',
        'RdYlBu',
        'RdYlGn',
        'Spectral',
      ],
    },
    {
      category: 'Cyclical',
      schemes: [
        'Rainbow',
        'Sinebow',
      ],
    },
  ];

  const colorPalettesCategorised = [
    {
      category: 'Categorised',
      schemes: [
        { name: 'Category10', steps: 10 },
        { name: 'Accent', steps: 8 },
        { name: 'Dark2', steps: 8 },
        { name: 'Paired', steps: 12 },
        { name: 'Pastel1', steps: 9 },
        { name: 'Pastel2', steps: 8 },
      ],
    },
  ];

  const colorScaleSelectOptionsGraduated = colorPalettes.map((category) => {
    const elements = [];
    elements.push(<ListSubheader>{category.category}</ListSubheader>);
    category.schemes.map((palette) => (
      elements.push(
        <MenuItem key={`textLabelColumn-${palette}`} value={palette} size="small">
          <div>
            <div style={{ width: 50, display: 'inline-block' }}>
              <ColorScale
                colorScale={palette}
                steps={layer.style.fillSteps}
                colorScaleType={layer.style.fillScaleType}
                containerClass="colorScaleSelect"
                inverted={layer.style.fillScaleInvert}
              />
            </div>
            {palette}
          </div>
        </MenuItem>,
      )
    ));
    return elements;
  });

  const colorScaleSelectOptionsCategorised = colorPalettesCategorised.map((category) => {
    const elements = [];
    elements.push(<ListSubheader>{category.category}</ListSubheader>);
    category.schemes.map((palette) => (
      elements.push(
        <MenuItem key={`textLabelColumn-${palette.name}`} value={palette.name} size="small">
          <div>
            <div style={{ width: 50, display: 'inline-block' }}>
              <ColorScale
                colorScale={palette.name}
                steps={palette.steps}
                colorScaleType="categorised"
                containerClass="colorScaleSelect"
                inverted={layer.style.fillScaleInvert}
              />
            </div>
            {palette.name}
          </div>
        </MenuItem>,
      )
    ));
    return elements;
  });

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={polygon} alt="" />
          </div>
          Polygon Options
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

          <hr />

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Fill type</div>
            <div className={styles.optionValue}>
              <ToggleButtonGroup
                fullWidth
                value={layer.style.fillType}
                color="primary"
                exclusive
                size="small"
                onChange={(e, val) => updateStyle('fillType', val)}
                aria-label="Fill type"
              >
                <ToggleButton value="single">Single</ToggleButton>
                <ToggleButton value="graduated">Graduated</ToggleButton>
                <ToggleButton value="categorical">Categorical</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {layer.style.fillType === 'single' && (
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Color fill type</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillSingleType}
                      onChange={(e, val) => updateStyle('fillSingleType', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      <MenuItem key="solid" value="solid" size="small">
                        <img src={fillSolid} alt="" style={{ height: 11, paddingRight: 5 }} />
                        Solid
                      </MenuItem>
                      <MenuItem key="pattern" value="pattern" size="small">
                        <img src={fillPattern} alt="" style={{ height: 11, paddingRight: 5 }} />
                        Pattern
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Fill color</div>
                <div className={styles.optionValue}>
                  <ColorPicker color={layer.style.fill} setColor={setFill} />
                </div>
              </div>
              {layer.style.fillSingleType === 'pattern' && (
                <div>
                  <div className={styles.optionRow}>
                    <div className={styles.optionLabel}>Spacing</div>
                    <Slider
                      aria-label="Spacing"
                      value={layer.style.fillPatternSpacing}
                      size="small"
                      onChange={(e, val) => updateStyle('fillPatternSpacing', val)}
                      valueLabelDisplay="auto"
                      step={0.01}
                      color="primary"
                      theme={theme}
                      min={1}
                      max={8}
                    />
                  </div>
                  <div className={styles.optionRow}>
                    <div className={styles.optionLabel}>Size</div>
                    <Slider
                      aria-label="Size"
                      value={layer.style.fillPatternSize}
                      size="small"
                      onChange={(e, val) => updateStyle('fillPatternSize', val)}
                      valueLabelDisplay="auto"
                      step={0.1}
                      color="primary"
                      theme={theme}
                      min={0.1}
                      max={10}
                    />
                  </div>
                  <div className={styles.optionRow}>
                    <div className={styles.optionLabel}>Angle</div>
                    <Slider
                      aria-label="Angle"
                      value={layer.style.fillPatternAngle}
                      size="small"
                      onChange={(e, val) => updateStyle('fillPatternAngle', val)}
                      valueLabelDisplay="auto"
                      step={1}
                      color="primary"
                      theme={theme}
                      min={0}
                      max={180}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {(layer.style.fillType === 'graduated') && (
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Data column</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillColumn}
                      onChange={(e, val) => updateStyle('fillColumn', val.props.value)}
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
                      value={layer.style.fillDataMin || 0}
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
                      value={layer.style.fillDataMax || 0}
                      type="number"
                      disabled
                      size="small"
                    />
                  </FormControl>
                </Box>
              </div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Scale type</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillScaleType}
                      onChange={(e, val) => updateStyle('fillScaleType', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      <MenuItem key="continuous" value="continuous" size="small">
                        Continuous
                      </MenuItem>
                      <MenuItem key="steps" value="steps" size="small">
                        Steps
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <ColorScale
                colorScale={layer.style.fillPalette}
                steps={layer.style.fillSteps}
                colorScaleType={layer.style.fillScaleType}
                pow={layer.style.fillPow}
                containerClass="colorScaleDiv"
                inverted={layer.style.fillScaleInvert}
              />
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Fill palette</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillPalette}
                      onChange={(e, val) => updateStyle('fillPalette', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      {colorScaleSelectOptionsGraduated}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {layer.style.fillScaleType === 'steps' && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Steps</div>
                <Slider
                  aria-label="Stroke width"
                  value={layer.style.fillSteps}
                  size="small"
                  onChange={(e, val) => updateStyle('fillSteps', val)}
                  valueLabelDisplay="auto"
                  step={1}
                  color="primary"
                  marks
                  theme={theme}
                  min={1}
                  max={12}
                />
              </div>
              )}
              {layer.style.fillScaleType === 'continuous' && (
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Log exponent</div>
                <Slider
                  aria-label="Stroke width"
                  value={layer.style.fillPow}
                  size="small"
                  onChange={(e, val) => updateStyle('fillPow', val)}
                  valueLabelDisplay="auto"
                  step={0.1}
                  color="primary"
                  theme={theme}
                  min={1}
                  max={5}
                />
              </div>
              )}
              <div className={styles.optionRow}>
                <div className="styles.optionLabel optionPaddingTop">Invert scale</div>
                <div className="styles.optionValueFloat">
                  <Switch
                    checked={layer.style.fillScaleInvert}
                    color="default"
                    onChange={(e, val) => updateStyle('fillScaleInvert', val)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              </div>
            </div>
          )}

          {(layer.style.fillType === 'categorical') && (
            <div>
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Data column</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth size="small">
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillColumn}
                      onChange={(e, val) => updateStyle('fillColumn', val.props.value)}
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
              <ColorScale
                colorScale={layer.style.fillPaletteCategorised}
                steps={layer.style.fillSteps}
                colorScaleType="categorised"
                pow={layer.style.fillPow}
                containerClass="colorScaleDiv"
                inverted={layer.style.fillScaleInvert}
              />
              <div className={styles.optionRow}>
                <div className={styles.optionLabel}>Fill palette</div>
                <div className={styles.optionValue}>
                  <FormControl fullWidth>
                    <Select
                      labelId="text-column-label"
                      id="text-column"
                      value={layer.style.fillPaletteCategorised}
                      onChange={(e, val) => updateStyle('fillPaletteCategorised', val.props.value)}
                      size="small"
                      style={{ backgroundColor: '#fff', fontSize: 12 }}
                      variant="standard"
                    >
                      {colorScaleSelectOptionsCategorised}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className={styles.optionRow}>
                <div className="styles.optionLabel optionPaddingTop">Invert scale</div>
                <div className="styles.optionValueFloat">
                  <Switch
                    checked={layer.style.fillScaleInvert}
                    color="default"
                    onChange={(e, val) => updateStyle('fillScaleInvert', val)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </div>
              </div>
            </div>
          )}

          <hr />

          <div className={styles.optionRow}>
            <div className="styles.optionLabel optionPaddingTop">Show text labels</div>
            <div className="styles.optionValueFloat">
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

              <FontPicker style={layer.style.labelStyle} updateFontStyle={updateFontStyle} variant="vector" />

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
        </div>
      </div>
    </div>
  );
}

export default OptionsVector;

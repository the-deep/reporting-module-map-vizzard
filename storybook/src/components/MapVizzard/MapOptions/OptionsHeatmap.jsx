import React from 'react';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import {
  FormControl,
} from '@mui/material';
import ColorScale from './ColorScale';
import styles from './MapOptions.module.css';

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
];

function OptionsHeatmap({ layer, activeLayer, updateLayer }) {
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

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            {/* <img src={point} alt="" /> */}
          </div>
          Heatmap Options
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
            <div className={styles.optionLabel}>Fill palette</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={layer.fillPalette}
                  onChange={(e, val) => updateAttr('fillPalette', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  {colorScaleSelectOptionsGraduated}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Blur</div>
            <Slider
              aria-label="Blur"
              value={layer.blur}
              size="small"
              onChange={(e, val) => updateAttr('blur', val)}
              valueLabelDisplay="auto"
              step={0.1}
              color="primary"
              theme={theme}
              min={0.1}
              max={20}
            />
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Radius</div>
            <Slider
              aria-label="Radius"
              value={layer.radius}
              size="small"
              onChange={(e, val) => updateAttr('radius', val)}
              valueLabelDisplay="auto"
              step={0.1}
              color="primary"
              theme={theme}
              min={0.1}
              max={20}
            />
          </div>

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Weighted
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={layer.weighted}
                color="default"
                onChange={(e, val) => updateAttr('weighted', val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

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

export default OptionsHeatmap;

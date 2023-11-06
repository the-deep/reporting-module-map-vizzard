import React from 'react';
import Slider from '@mui/material/Slider';
// import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import ListSubheader from '@mui/material/ListSubheader';
// import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
// import { ToggleButton, ToggleButtonGroup, FormControl } from '@mui/material';
import ColorPicker from './ColorPicker';
import polygon from '../assets/polygon.svg';
import styles from './MapOptions.module.css';

function OptionsLine({ layer, activeLayer, updateLayer }) {
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

  const setStroke = (d) => {
    updateStyle('stroke', d);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={polygon} alt="" />
          </div>
          Line Options
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

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Stroke type</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={layer.style.strokeType}
                  onChange={(e, val) => updateStyle('strokeType', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  <MenuItem key="solid" value="solid" size="small">
                    Solid
                  </MenuItem>
                  <MenuItem key="pattern" value="dash" size="small">
                    Dashed
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {(layer.style.strokeType === 'dash') && (
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>Dash spacing</div>
              <Slider
                aria-label="Stroke width"
                value={layer.style.dashSpacing}
                size="small"
                onChange={(e, val) => updateStyle('dashSpacing', val)}
                valueLabelDisplay="auto"
                step={0.1}
                color="primary"
                theme={theme}
                min={0.1}
                max={5}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OptionsLine;

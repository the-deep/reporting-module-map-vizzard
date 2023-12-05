import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { FormControl } from '@mui/material';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import colorPickerStyles from './ColorPicker.module.css';
import styles from './MapOptions.module.css';

function FontPicker({ style, updateFontStyle, variant }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const updateColor = (c) => {
    updateFontStyle('color', c.rgb);
  };

  // materialUI theme
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  return (
    <div>
      <div className={styles.optionRow}>
        <div className={styles.optionLabel}>Font colour</div>
        <div className={styles.optionValue}>
          <div className={colorPickerStyles.swatch} onClick={handleClick} role="presentation">
            <div className={colorPickerStyles.color} style={{ background: `rgba(${style.color.r}, ${style.color.g}, ${style.color.b}, ${style.color.a})` }} />
          </div>
          {displayColorPicker ? (
            <div className={colorPickerStyles.popover}>
              <div className={colorPickerStyles.cover} onClick={handleClose} role="presentation" />
              <SketchPicker color={style.color} onChange={updateColor} />
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.optionRow}>
        <div className={styles.optionLabel}>Font family</div>
        <div className={styles.optionValue}>
          <FormControl fullWidth>
            <Select
              labelId="text-column-label"
              id="text-column"
              value={style.fontFamily}
              onChange={(e, val) => updateFontStyle('fontFamily', val.props.value)}
              size="small"
              style={{ backgroundColor: '#fff', fontSize: 12 }}
              variant="standard"
            >
              <MenuItem key="Alegreya" value="Alegreya" size="small">
                Alegreya
              </MenuItem>
              <MenuItem key="Barlow" value="Barlow" size="small">
                Barlow
              </MenuItem>
              <MenuItem key="Barlow Condensed" value="Barlow Condensed" size="small">
                Barlow Condensed
              </MenuItem>
              <MenuItem key="Lato" value="Lato" size="small">
                Lato
              </MenuItem>
              <MenuItem key="Montserrat" value="Montserrat" size="small">
                Montserrat
              </MenuItem>
              <MenuItem key="Open Sans" value="Open Sans" size="small">
                Open Sans
              </MenuItem>
              <MenuItem key="Raleway" value="Raleway" size="small">
                Raleway
              </MenuItem>
              <MenuItem key="Roboto" value="Roboto" size="small">
                Roboto
              </MenuItem>
              <MenuItem key="RobotoSlab" value="Roboto Slab" size="small">
                Roboto Slab
              </MenuItem>
              {/* <MenuItem key="Source Sans Pro" value="Source Sans Pro" size="small">
                Source Sans Pro
              </MenuItem>
              <MenuItem key="Source Serif Pro" value="Source Serif Pro" size="small">
                Source Serif Pro
              </MenuItem> */}
            </Select>
          </FormControl>
        </div>
      </div>
      {(variant !== 'general') && (
      <div>
        <div className={styles.optionRow}>
          <div className={styles.optionLabel}>Font size (px)</div>
          <Slider
            aria-label="Font size (px)"
            value={style.fontSize}
            size="small"
            onChange={(e, val) => updateFontStyle('fontSize', val)}
            valueLabelDisplay="auto"
            step={0.1}
            color="primary"
            theme={theme}
            min={3}
            max={34}
          />
        </div>
        <div className={styles.optionRow}>
          <div className={styles.optionLabel}>Font weight</div>
          <div className={styles.optionValue}>
            <FormControl fullWidth>
              <Select
                labelId="text-column-label"
                id="text-column"
                value={style.fontWeight}
                onChange={(e, val) => updateFontStyle('fontWeight', val.props.value)}
                size="small"
                style={{ backgroundColor: '#fff', fontSize: 12 }}
                variant="standard"
              >
                <MenuItem key="normal" value="normal" size="small">
                  normal
                </MenuItem>
                <MenuItem key="bold" value="bold" size="small">
                  bold
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={styles.optionRow}>
          <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>Show halo</div>
          <div className={styles.optionValueFloat}>
            <Switch
              checked={style.showHalo}
              color="default"
              onChange={(e, val) => updateFontStyle('showHalo', val)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default FontPicker;

export function rgba(rgb) {
  if (rgb && typeof rgb !== 'undefined' && rgb.a >= 0) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
  }
  return null;
}

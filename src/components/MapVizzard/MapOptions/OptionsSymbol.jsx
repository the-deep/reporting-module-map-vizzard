import { useContext, useEffect } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import { MuiColorInput } from 'mui-color-input';
import TextField from '@mui/material/TextField';
import {
  FormGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import MapContext from '../../Map/MapContext';
import styles from './MapOptions.module.css';
import point from '../assets/point.svg';

import capital from '../../Map/assets/map-icons/capital.svg';
import city from '../../Map/assets/map-icons/city.svg';
import settlement from '../../Map/assets/map-icons/settlement.svg';
import marker from '../../Map/assets/map-icons/marker.svg';
import airport from '../../Map/assets/map-icons/airport.svg';
import idpRefugeeCamp from '../../Map/assets/map-icons/idp-refugee-camp.svg';

function OptionsSymbol({ layer, activeLayer, updateLayer }) {
  const symbolIcons = {
    capital,
    city,
    settlement,
    'idp-refugee-camp': idpRefugeeCamp,
    airport,
    marker,
  };

  const symbols = Object.keys(symbolIcons);

  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const setOpacity = (d) => {
    layer.opacity = d;
    updateLayer(layer, activeLayer);
  };

  const setShowLabels = (d) => {
    layer.showLabels = d;
    updateLayer(layer, activeLayer);
  };

  const setSymbol = (d) => {
    layer.symbol = d;
    updateLayer(layer, activeLayer);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={point} />
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
                onChange={(e) => {
                  layer.name = e.target.value;
                  updateLayer(layer, activeLayer);
                }}
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
              onChange={(e, val) => setOpacity(val)}
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
                onChange={(e, val) => setSymbol(val.props.value)}
                label="Symbol"
                variant="outlined"
                size="small"
              >
                {symbols.map((symbol, i) => (
                  <MenuItem key={symbol} value={symbol}>
                    <img
                      className={styles.mapSymbolSelectIcon}
                      src={symbolIcons[symbol]}
                    />
                    &nbsp;
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={`${styles.optionLabel} ${styles.optionPaddingTop}`}>
              Show text labels
            </div>
            <div className={styles.optionValueFloat}>
              <Switch
                checked={layer.showLabels}
                color="default"
                onChange={(e, val) => setShowLabels(val)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>

          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default OptionsSymbol;

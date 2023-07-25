import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import {
  InputLabel,
  FormControl,
} from '@mui/material';
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

  const columns = Object.keys({ ...layer.data[0] });

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
                    {columns
                      .sort()
                      .map((labelColumn) => (
                        <MenuItem key={`textLabelColumn-${labelColumn}`} value={labelColumn}>
                          {labelColumn}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          )}

          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default OptionsSymbol;

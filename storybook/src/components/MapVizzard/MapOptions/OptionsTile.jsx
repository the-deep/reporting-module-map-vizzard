import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import {
  FormControl,
} from '@mui/material';
import styles from './MapOptions.module.css';
import raster from '../assets/raster.svg';

function OptionsTile({
  layer, activeLayer, updateLayer,
}) {
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
            <img src={raster} alt="" />
          </div>
          Raster Options
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
            <div className={styles.optionLabel}>Layer style</div>
            <div className={styles.optionValueFloat}>
              <Chip label={layer.type} size="small" />
            </div>
          </div>

          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default OptionsTile;

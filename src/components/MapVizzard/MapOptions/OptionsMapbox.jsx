import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';
import styles from './MapOptions.module.css';
import raster from '../assets/raster.svg';

function OptionsMapbox({
  layer,
  activeLayer,
  updateLayer,
}) {
  const styleOptions = [
    { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
    { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
    { label: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
    { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
    { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
    { label: 'Satellite-Streets', value: 'mapbox://styles/mapbox/satellite-streets-v10' },
    { label: 'Custom', value: 'mapbox://styles/matthewsmawfield/clidxtx3j003p01r0cetzc9iv' },
  ];

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
          Mapbox Options
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
            <div className={styles.optionLabelSm}>Style</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={layer.style}
                  onChange={(e, val) => updateAttr('style', val.props.value)}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                  {styleOptions.map((style) => (
                    <MenuItem key={style.label} value={style.value}>
                      {style.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Style URL"
                variant="standard"
                value={layer.style}
                onChange={(e) => updateAttr('style', e.target.value)}
              />
            </FormControl>
          </div>

          <hr />

          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default OptionsMapbox;

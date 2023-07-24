import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import TextField from '@mui/material/TextField';
import {
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
} from '@mui/material';
import ColorPicker from './ColorPicker';
import styles from './MapOptions.module.css';
import polygon from '../assets/polygon.svg';

function OptionsVector({ layer, activeLayer, updateLayer }) {
  // remove null columns for the text name dropdown select
  let columns = { ...layer.data.features[0].properties };
  const allColumns = { ...layer.data.features[0].properties };

  const removeEmpty = (obj) => {
    const objClone = { ...obj };
    Object.entries(objClone).forEach(
      ([key, val]) => (val && typeof val === 'object' && removeEmpty(val))
        || ((val === null || val === '') && delete objClone[key]),
    );
    return objClone;
  };

  columns = removeEmpty(allColumns);

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

  const setFill = (d) => {
    updateStyle('fill', d);
  };

  const setStroke = (d) => {
    updateStyle('stroke', d);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}><img src={polygon} alt="" /></div>
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
                <ToggleButton value="categorised">Categorical</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {layer.style.fillType === 'single' && (
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>Fill color</div>
              <div className={styles.optionValue}>
                <ColorPicker color={layer.style.fill} setColor={setFill} />
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
                          {labelColumn}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OptionsVector;

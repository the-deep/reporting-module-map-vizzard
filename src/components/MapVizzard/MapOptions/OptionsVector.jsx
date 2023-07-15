import { useContext, useEffect } from "react";
import MapContext from "../../Map/MapContext";
import ColourPicker from "./ColourPicker";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TextField from "@mui/material/TextField";
import {
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import styles from "./MapOptions.module.css";


const OptionsVector = ({ layer, activeLayer, updateLayer }) => {
  // remove null columns for the text name dropdown select
  let columns = layer.data.features[0].properties;
  const allColumns = layer.data.features[0].properties;

  const removeEmpty = (obj) => {
    Object.entries(obj).forEach(
      ([key, val]) =>
        (val && typeof val === "object" && removeEmpty(val)) ||
        ((val === null || val === "") && delete obj[key])
    );
    return obj;
  };

  columns = removeEmpty(allColumns);

  // materialUI theme
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  // update layer functions
  const setOpacity = (d) => {
    layer.opacity = d;
    updateLayer(layer, activeLayer);
  };

  const setFill = (d) => {
    layer.style.fill = d;
    updateLayer(layer, activeLayer);
  };

  const setFillType = (d) => {
    layer.style.fillType = d;
    updateLayer(layer, activeLayer);
  };

  const setStroke = (d) => {
    layer.style.stroke = d;
    updateLayer(layer, activeLayer);
  };

  const setStrokeWidth = (d) => {
    layer.style.strokeWidth = d;
    updateLayer(layer, activeLayer);
  };

  const setShowLabels = (d) => {
    layer.showLabels = d;
    updateLayer(layer, activeLayer);
  };

  const setLabelColumn = (d) => {
    layer.labelColumn = d;
    updateLayer(layer, activeLayer);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
        <div className={styles.mapOptions_icon}><img src={process.env.PUBLIC_URL + "/icons/polygon.svg"}/></div>
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
            <div className={styles.optionLabel}>Stroke colour</div>
            <div className={styles.optionValue}>
              <ColourPicker colour={layer.style.stroke} setColour={setStroke} />
            </div>
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Stroke width</div>
            <Slider
              aria-label="Stroke width"
              value={layer.style.strokeWidth}
              size="small"
              onChange={(e, val) => setStrokeWidth(val)}
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
                onChange={(e, val) => setFillType(val)}
                aria-label="Fill type"
              >
                <ToggleButton value="single">Single</ToggleButton>
                <ToggleButton value="graduated">Graduated</ToggleButton>
                <ToggleButton value="categorised">Categorical</ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>

          {layer.style.fillType == "single" && (
            <div className={styles.optionRow}>
              <div className={styles.optionLabel}>Fill colour</div>
              <div className={styles.optionValue}>
                <ColourPicker colour={layer.style.fill} setColour={setFill} />
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
                onChange={(e, val) => setShowLabels(val)}
                inputProps={{ "aria-label": "controlled" }}
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
                    onChange={(e, val) => setLabelColumn(val.props.value)}
                    size="small"
                    style={{ backgroundColor: "#fff", fontSize: 12}}
                    variant="standard"
                  >
                    {Object.keys(columns)
                      .sort()
                      .map((labelColumn, i) => (
                        <MenuItem key={labelColumn + i} value={labelColumn}>
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
};

export default OptionsVector;
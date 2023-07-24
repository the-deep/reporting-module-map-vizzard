import { useState } from "react";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";
import { Draw, Modify, Snap } from "ol/interaction";
import MultiPoint from "ol/geom/MultiPoint";
import WKT from "ol/format/WKT.js";
import Feature from "ol/Feature";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Circle } from "ol/style";
import { transform } from "ol/proj";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import {
  FormGroup,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  Radio,
  RadioGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import styles from "./MapOptions.module.css";
import raster from "../assets/raster.svg";

function OptionsMapbox({ layer, activeLayer, updateLayer, map }) {

  const [customStyle, setCustomStyle] = useState(false);
  
  const styleOptions = [
    {'label': 'Streets', 'value': 'mapbox://styles/mapbox/streets-v12'},
    {'label': 'Outdoors', 'value': 'mapbox://styles/mapbox/outdoors-v12'},
    {'label': 'Light', 'value': 'mapbox://styles/mapbox/light-v11'},
    {'label': 'Dark', 'value': 'mapbox://styles/mapbox/dark-v11'},
    {'label': 'Satellite', 'value': 'mapbox://styles/mapbox/satellite-v9'},
    {'label': 'Satellite-Streets', 'value': 'mapbox://styles/mapbox/satellite-streets-v10'},
    {'label': 'Custom', 'value': 'mapbox://styles/matthewsmawfield/clidxtx3j003p01r0cetzc9iv'},
  ];

  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const setOpacity = (d) => {
    layer.opacity = d;
    updateLayer(layer, activeLayer);
  };

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={raster} />
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
            <div className={styles.optionLabelSm}>Style</div>
            <div className={styles.optionValue}>
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={layer.style}
                  onChange={(e, val) => {
                    // if(val.props.children==="Custom"){
                      // setCustomStyle(true);
                    // } else {
                      // setCustomStyle(false);
                      layer.style = (val.props.value);
                      updateLayer(layer, activeLayer)

                    // }
                  }}
                  size="small"
                  style={{ backgroundColor: '#fff', fontSize: 12 }}
                  variant="standard"
                >
                   {styleOptions.map((style, i) => (
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
                onChange={(e) => {
                  layer.style = e.target.value;
                  updateLayer(layer, activeLayer);
                }}
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

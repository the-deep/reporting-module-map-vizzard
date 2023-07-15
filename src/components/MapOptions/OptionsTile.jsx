import { useEffect } from "react";
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

const OptionsTile = ({ layer, activeLayer, updateLayer, map }) => {

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
            <img src={process.env.PUBLIC_URL + "/icons/raster.svg"} />
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
};

export default OptionsTile;

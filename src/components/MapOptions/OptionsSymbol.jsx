import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";
import { FormGroup, FormControlLabel } from "@mui/material";

const OptionsSymbol = ({ layer, activeLayer, updateLayer }) => {
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

  // const setFill = (d) => {
  //   layer.style.fill = d;
  //   updateLayer(layer, activeLayer);
  // }

  // const setStroke = (d) => {
  //   layer.style.stroke = d;
  //   updateLayer(layer, activeLayer);
  // }

  // const setStrokeWidth = (d) => {
  //   layer.style.strokeWidth = d;
  //   updateLayer(layer, activeLayer);
  // }

  return (
    <div className="optionsPanel">
      <div className="optionRow">
        <div className="optionLabel">Layer name</div>
        <div className="optionValue">{layer.name}</div>
      </div>

      <div className="optionRow">
        <div className="optionLabel">Layer type</div>
        <div className="optionValue">
          <Chip label={layer.type} size="small" />
        </div>
      </div>

      <div className="optionRow">
        <div className="optionLabel">Opacity</div>
        <Slider
          aria-label="Opacity"
          value={layer.opacity}
          size="small"
          onChange={(e, val) => setOpacity(val)}
          // getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={0.01}
          color="primary"
          theme={theme}
          min={0}
          max={1}
        />
      </div>

      <div className="optionRow">
        <div className="optionLabel">Show text labels</div>
        <div className="optionValue">
          <Switch
            checked={layer.showLabels}
            color="default"
            onChange={(e, val) => setShowLabels(val)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>

      <br />
      <br />
    </div>
  );
};

export default OptionsSymbol;

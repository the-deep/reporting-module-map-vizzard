import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";

import {
  FormGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";

const OptionsVector = ({ layer, activeLayer, updateLayer }) => {

  let columns = layer.data.features[0].properties;
  const allColumns = layer.data.features[0].properties;

  const removeEmpty = (obj) => {
    Object.entries(obj).forEach(([key, val])  =>
      (val && typeof val === 'object') && removeEmpty(val) ||
      (val === null || val === "") && delete obj[key]
    );
    return obj;
  };

  columns = removeEmpty(allColumns)

  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const setOpacity = (d) => {
    layer.opacity = d;
    updateLayer(layer, activeLayer);
  };

  const setFill = (d) => {
    layer.style.fill = d;
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
        <div className="optionLabel">Fill colour</div>
        <div className="optionValue">
          <MuiColorInput
            format="hex8"
            aria-label="Fill colour"
            value={layer.style.fill.hex8}
            onChange={(e, val) => setFill(val)}
            size="small"
          />
        </div>
      </div>
      <br />
      <div className="optionRow">
        <div className="optionLabel">Stroke colour</div>
        <div className="optionValue">
          <MuiColorInput
            format="hex8"
            aria-label="Stroke colour"
            value={layer.style.stroke.hex8}
            onChange={(e, val) => setStroke(val)}
            size="small"
          />
        </div>
      </div>
      <br />

      <div className="optionRow">
        <div className="optionLabel">Stroke width</div>
        <Slider
          aria-label="Stroke width"
          value={layer.style.strokeWidth}
          size="small"
          onChange={(e, val) => setStrokeWidth(val)}
          // getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={0.1}
          color="primary"
          theme={theme}
          min={0.1}
          max={5}
        />
      </div>

      <div className="optionRow">
        <div className="optionLabel optionPaddingTop">Show text labels</div>
        <div className="optionValue">
          <Switch
            checked={layer.showLabels}
            color="default"
            onChange={(e, val) => setShowLabels(val)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>
      <div className="optionRow" style={{paddingTop: 9}}>
        <FormControl fullWidth >
          <InputLabel id="text-column-label" syle={{marginLeft: -14}}>Text label column</InputLabel>
          <Select
            labelId="text-column-label"
            id="text-column"
            value={layer.labelColumn}
            onChange={(e, val) => setLabelColumn(val.props.value)}
            size="small"
            variant="standard"
          >
            {Object.keys(columns).sort().map((labelColumn,i) => (
              
              <MenuItem key={labelColumn+i} value={labelColumn}>
                {/* <img
                  className="mapLabelColumnSelectIcon"
                  src={process.env.PUBLIC_URL + "/map-icons/" + symbol + ".svg"}
                />
                &nbsp;
                */}
                {labelColumn} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>


    </div>
  );
};

export default OptionsVector;

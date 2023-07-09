import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
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
import {
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";

const OptionsVector = ({ layer, activeLayer, updateLayer }) => {
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
    <div className="optionsPanel">
      <div className="optionRow">
        <div className="optionLabel">Layer name</div>
        <div className="optionValueFloat">{layer.name}</div>
      </div>

      <div className="optionRow">
        <div className="optionLabel">Layer type</div>
        <div className="optionValueFloat">
          <Chip label={layer.type} size="small" />
        </div>
      </div>

      <hr />

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

      <hr />

      <div className="optionRow">
        <div className="optionLabel">Stroke colour</div>
        <div className="optionValue">
          <ColourPicker colour={layer.style.stroke} setColour={setStroke}/>
        </div>
      </div>

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

      <hr />

      <div className="optionRow">
        <div className="optionLabel">Fill type</div>
        <div className="optionValue">
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
        <div className="optionRow">
          <div className="optionLabel">Fill colour</div>
          <div className="optionValue">
            <ColourPicker colour={layer.style.fill} setColour={setFill}/>
          </div>
        </div>
      )}

      <hr />

      <div className="optionRow">
        <div className="optionLabel optionPaddingTop">Show text labels</div>
        <div className="optionValueFloat">
          <Switch
            checked={layer.showLabels}
            color="default"
            onChange={(e, val) => setShowLabels(val)}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>

      {layer.showLabels && (

      <div className="optionRow">
        <div className="optionLabel">Text label column</div>
        <div className="optionValue">
          <FormControl fullWidth>
            <Select
              labelId="text-column-label"
              id="text-column"
              value={layer.labelColumn}
              onChange={(e, val) => setLabelColumn(val.props.value)}
              size="small"
              style={{ backgroundColor: "#fff" }}
              variant="standard"
            >
              {Object.keys(columns)
                .sort()
                .map((labelColumn, i) => (
                  <MenuItem key={labelColumn + i} value={labelColumn}>
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
      )}

    </div>
  );
};

export default OptionsVector;

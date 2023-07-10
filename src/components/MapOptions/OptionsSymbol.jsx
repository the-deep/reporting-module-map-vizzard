import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";
import TextField from "@mui/material/TextField";
import {
  FormGroup,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";

const OptionsSymbol = ({ layer, activeLayer, updateLayer }) => {
  const symbols = [
    "capital",
    "city",
    "settlement",
    "marker",
    "airport",
    "idp-refugee-camp",
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

  const setShowLabels = (d) => {
    layer.showLabels = d;
    updateLayer(layer, activeLayer);
  };

  const setSymbol = (d) => {
    layer.symbol = d;
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
    <div>
      <div className="mapOptionsPanel">
        <h1>
          <div className="mapOptions_icon">
            <img src={process.env.PUBLIC_URL + "/icons/point.svg"} />
          </div>
          Symbol Options
        </h1>
      </div>
      <div className="mapOptionsPanelBody">
        <div className="optionsPanel">
          
        <div className="optionRow">
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
            <FormControl fullWidth>
              <InputLabel id="symbol-select-label">Symbol</InputLabel>
              <Select
                labelId="symbol-select-label"
                id="symbol-select"
                style={{ backgroundColor: "#fff" }}
                value={layer.symbol}
                onChange={(e, val) => setSymbol(val.props.value)}
                label="Symbol"
                variant="outlined"
                size="small"
              >
                {symbols.map((symbol, i) => (
                  <MenuItem key={symbol + i} value={symbol}>
                    <img
                      className="mapSymbolSelectIcon"
                      src={
                        process.env.PUBLIC_URL + "/map-icons/" + symbol + ".svg"
                      }
                    />
                    &nbsp;{symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

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

          

          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default OptionsSymbol;

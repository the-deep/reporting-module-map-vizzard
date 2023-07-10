import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
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

const OptionsMapGeneral = ({ mapOptions, updateMapOptions }) => {
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  return (
    <div>
      <div className="mapOptionsPanel">
        <h1>
          <div className="mapOptions_icon">
            <img src={process.env.PUBLIC_URL + "/icons/settings.svg"} />
          </div>
          Map Options
        </h1>
      </div>
      <div className="mapOptionsPanelBody">
        <div className="optionsPanel">
          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Main title"
                variant="standard"
                value={mapOptions.mainTitle}
                onChange={(e) => {
                  mapOptions.mainTitle = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Sub-title"
                size="small"
                variant="standard"
                value={mapOptions.subTitle}
                onChange={(e) => {
                  mapOptions.subTitle = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <hr />

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Height (px)"
                variant="standard"
                value={mapOptions.height}
                type="number"
                size="small"
                inputProps={{
                  step: 1,
                }}
                onChange={(e) => {
                  mapOptions.height = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Width (px)"
                variant="standard"
                value={mapOptions.width}
                type="number"
                size="medium"
                inputProps={{
                  step: 1,
                }}
                onChange={(e) => {
                  mapOptions.width = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <hr />

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Center latitude"
                variant="standard"
                value={mapOptions.center.lat}
                type="number"
                inputProps={{
                  step: 0.1,
                }}
                onChange={(e) => {
                  mapOptions.center.lat = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Center longitude"
                variant="standard"
                value={mapOptions.center.lon}
                type="number"
                inputProps={{
                  step: 0.1,
                }}
                onChange={(e) => {
                  mapOptions.center.lon = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <div className="optionRow">
            <FormControl fullWidth>
              <TextField
                label="Initial zoom"
                variant="standard"
                value={mapOptions.zoom}
                type="number"
                inputProps={{
                  step: 0.05,
                }}
                onChange={(e) => {
                  mapOptions.zoom = e.target.value;
                  updateMapOptions(mapOptions);
                }}
              />
            </FormControl>
          </div>

          <hr />

          <div className="optionRow">
            <div className="optionLabel optionPaddingTop">Show scale bar</div>
            <div className="optionValueFloat">
              <Switch
                checked={mapOptions.showScale}
                color="default"
                onChange={(e, val) => {
                  mapOptions.showScale = val;
                  updateMapOptions(mapOptions);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
          </div>

          {mapOptions.showScale && (
          <div className="optionRow">
            <div className="optionLabel">Scale position</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleBarPosition}
                  onChange={(e, val) => {
                    mapOptions.scaleBarPosition = (val.props.value);
                    updateMapOptions(mapOptions);
                  }}
                  size="small"
                  style={{ backgroundColor: "#fff", fontSize: 12}}
                  variant="standard"
                >
                    <MenuItem key="scaleBarPositionBottomLeft" value="bottom-left">Bottom left</MenuItem>
                    <MenuItem key="scaleBarPositionBottomRight" value="bottom-right">Bottom right</MenuItem>
                    <MenuItem key="scaleBarPositionTopRight" value="top-right">Top right</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          {mapOptions.showScale && (
          <div className="optionRow">
            <div className="optionLabel">Scale units</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleUnits}
                  onChange={(e, val) => {
                    mapOptions.scaleUnits = val.props.value;
                    updateMapOptions(mapOptions);
                  }}
                  size="small"
                  style={{ backgroundColor: "#fff", fontSize: 12}}
                  variant="standard"
                >
                    <MenuItem key="scaleUnit1" value="metric">metric (km)</MenuItem>
                    <MenuItem key="scaleUnit2" value="imperial">imperial (miles)</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          )}

          {mapOptions.showScale && (
          <div className="optionRow">
            <div className="optionLabel">Scale style</div>
            <div className="optionValue">
              <FormControl fullWidth>
                <Select
                  labelId="text-column-label"
                  id="text-column"
                  value={mapOptions.scaleBar}
                  onChange={(e, val) => {
                    mapOptions.scaleBar = eval(val.props.value);
                    updateMapOptions(mapOptions);
                  }}
                  size="small"
                  style={{ backgroundColor: "#fff", fontSize: 12}}
                  variant="standard"
                >
                    <MenuItem key="scaleBarFalse" value="false">Line</MenuItem>
                    <MenuItem key="scaleBarTrue" value="true">Bars</MenuItem>
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

export default OptionsMapGeneral;

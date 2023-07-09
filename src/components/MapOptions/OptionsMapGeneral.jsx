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
    <div className="optionsPanel">

      <div className="optionRow">
        <FormControl fullWidth>
          <TextField
            label="Main title"
            variant="standard"
            value={mapOptions.mainTitle}
            onChange={(e) => { mapOptions.mainTitle = e.target.value; updateMapOptions(mapOptions); }}
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
            onChange={(e) => { mapOptions.subTitle = e.target.value; updateMapOptions(mapOptions); }}
          />
        </FormControl>
      </div>

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
            onChange={(e) => { mapOptions.height = e.target.value; updateMapOptions(mapOptions); }}
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
            onChange={(e) => { mapOptions.width = e.target.value; updateMapOptions(mapOptions); }}
          />
        </FormControl>
      </div>

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
            onChange={(e) => { mapOptions.center.lat = e.target.value; updateMapOptions(mapOptions); }}
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
            onChange={(e) => { mapOptions.center.lon = e.target.value; updateMapOptions(mapOptions); }}
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
            onChange={(e) => { mapOptions.zoom = e.target.value; updateMapOptions(mapOptions); }}
          />
        </FormControl>
      </div>

      <div className="optionRow">
        <div className="optionLabel optionPaddingTop">Show scale line</div>
        <div className="optionValueFloat">
          <Switch
            checked={mapOptions.showScale}
            color="default"
            onChange={(e, val) => { mapOptions.showScale = val; console.log(val); updateMapOptions(mapOptions); }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </div>
      </div>



    </div>
  );
};

export default OptionsMapGeneral;

import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import { MuiColorInput } from 'mui-color-input'

const OptionsVector = ({ layer, activeLayer, updateLayer}) => {

  // const { map } = useContext(MapContext);


  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });

  const setOpacity = (d) => {
    layer.opacity = d;
    updateLayer(layer, activeLayer);
  }

  const setFill = (d) => {
    layer.style.fill = d;
    updateLayer(layer, activeLayer);
  }

  const setStroke = (d) => {
    layer.style.stroke = d;
    updateLayer(layer, activeLayer);
  }

  const setStrokeWidth = (d) => {
    layer.style.strokeWidth = d;
    updateLayer(layer, activeLayer);
  }

  useEffect(() => {
    // if (!map) return;
    // let vectorLayer = new OLVectorLayer({
    //   source,
    //   style
    // });
    // map.addLayer(vectorLayer);
    // vectorLayer.setZIndex(zIndex);
    // vectorLayer.setOpacity(opacity);
    return () => {
      // if (map) {
        // map.removeLayer(vectorLayer);
      // }
    };
  }, []);

  return <div className="optionsPanel">
    <div className="optionRow">
      <div className="optionLabel">Layer name</div>
      <div className='optionValue'>{layer.name}</div>
    </div>

    <div className="optionRow">
      <div className="optionLabel">Layer type</div>
      <div className='optionValue'><Chip label={layer.type} size="small"/></div>
    </div>

    <div className="optionRow">
      <div className="optionLabel">Opacity</div>
      <Slider
        aria-label="Opacity"
        value={layer.opacity}
        size="small"
        onChange={(e,val) => setOpacity(val)}
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
      <div className='optionValue'>
      <MuiColorInput
        format="hex8"
        aria-label="Fill colour"
        value={layer.style.fill.hex8}
        onChange={(e,val) => setFill(val)}
        size="small"
      />
      </div>
    </div>
    <br/>
    <div className="optionRow">
      <div className="optionLabel">Stroke colour</div>
      <div className='optionValue'>
      <MuiColorInput
        format="hex8"
        aria-label="Stroke colour"
        value={layer.style.stroke.hex8}
        onChange={(e,val) => setStroke(val)}
        size="small"
      />
      </div>
    </div>
  <br/>

    <div className="optionRow">
      <div className="optionLabel">Stroke width</div>
      <Slider
        aria-label="Stroke width"
        value={layer.style.strokeWidth}
        size="small"
        onChange={(e,val) => setStrokeWidth(val)}
        // getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={0.1}
        color="primary"
        theme={theme}
        min={0.1}
        max={5}
      />
    </div>


<br/><br/>
  </div>


};

export default OptionsVector;
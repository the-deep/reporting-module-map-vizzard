import { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import Slider from "@mui/material/Slider";
import Chip from "@mui/material/Chip";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";
import { MuiColorInput } from "mui-color-input";
import { Draw, Modify, Snap } from "ol/interaction";
import MultiPoint from 'ol/geom/MultiPoint';
import WKT from "ol/format/WKT.js";
import Feature from "ol/Feature";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Circle} from "ol/style";
import {transform} from 'ol/proj';

const OptionsMask = ({ layer, activeLayer, updateLayer }) => {
  const { map } = useContext(MapContext);

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

  const setBlur = (d) => {
    layer.blur = d;
    updateLayer(layer, activeLayer);
  };

  const setStrokeWidth = (d) => {
    layer.style.strokeWidth = d;
    updateLayer(layer, activeLayer);
  };

  let draw, snap, modify;

  map.getLayers().forEach(function (el) {
    if (el && el.values_.id == "drawLayerMask") {
      map.removeLayer(el);
    }
  });

  map.getLayers().forEach(function (el) {
    if (el.values_.id && el.values_.id == 213) {

      var image = new Circle({
        radius: 4,
        fill: new Fill({
          color: 'grey',
        }),
        stroke: new Stroke({color: 'white', width: 1.5})
      });

      var drawLayerStyle = [new Style({
        image: image,
        geometry: function(feature) {
            var coordinates = feature.getGeometry().getCoordinates()[1];
            var coords = [];
            coordinates.forEach(function(d,i){
              coords.push(transform(d, 'EPSG:3857', 'EPSG:3857'))
            })
            return new MultiPoint(coords);
        }
      }), new Style({
        stroke: new Stroke({
          width: 1,
          color: '#a3a0a0',
        lineDash: [2,4],
        }),
        fill: new Fill({
          color: 'transparent',
        }),
      })]

      let polygon = layer.mask;

      let source = new VectorSource({ wrapX: false });
      let orginalSource = el.getSource();

      let drawLayer = new OLVectorLayer({
        source,
        style: drawLayerStyle,
        id: "drawLayerMask",
      });

      drawLayer.setZIndex(1000);


      if (polygon) {
        var format = new WKT(),
          wkt = format.readGeometry(polygon, {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
        var feature = new Feature(wkt);
        source.addFeature(feature);
        map.addLayer(drawLayer);
      } 

      map.getInteractions().forEach(function (interaction) {
        if (interaction instanceof Draw) {
          map.removeInteraction(interaction);
        }
        if (interaction instanceof Snap) {
          map.removeInteraction(interaction);
        }
        if (interaction instanceof Modify) {
          map.removeInteraction(interaction);
        }
      });

      draw = new Draw({
        source: source,
        type: "Polygon"
      });
      map.addInteraction(draw);

      // hide/show draw cursor on mouseout
      map.getViewport().addEventListener('mouseout', function(evt){
        draw.setActive(false);
      }, false);

      map.getViewport().addEventListener('mouseover', function(evt){
        draw.setActive(true);
      }, false);

      modify = new Modify({ source: source });
      snap = new Snap({ source: source });

      map.addInteraction(modify);
      map.addInteraction(snap);

      modify.on("modifyend", function (evt) {
        var collection = evt.features;
        var feature = collection.item(0);
        var format = new WKT(),
          wkt = format.writeGeometry(feature.getGeometry(), {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857",
          });
        layer.mask = wkt;
        updateLayer(layer, activeLayer);
      });

      draw.on("drawstart", function (e) {
        source.clear(); 
      });

      source.on(
        "addfeature",
        function (feature) {
          var format = new WKT(),
            wkt = format.writeGeometry(feature.feature.getGeometry(), {
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            });
          var b = "(0 90,180 90,180 -90,0 -90,-180 -90,-180 0,-180 90,0 90),";
          var position = 8;
          var invertedPolygon = [
            wkt.slice(0, position),
            b,
            wkt.slice(position),
          ].join("");
          layer.mask = invertedPolygon;
          layer.opacity = 1;
          updateLayer(layer, activeLayer);
        },
        this
      );
    }
  });

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

      {/* <div className="optionRow">
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
   */}

      <div className="optionRow">
        <div className="optionLabel">Blur radius</div>
        <Slider
          aria-label="Blur radius"
          value={layer.blur}
          size="small"
          onChange={(e, val) => setBlur(val)}
          valueLabelDisplay="auto"
          step={1}
          color="primary"
          theme={theme}
          min={0}
          max={20}
        />
      </div>

      <br />
      <br />
    </div>
  );
};

export default OptionsMask;

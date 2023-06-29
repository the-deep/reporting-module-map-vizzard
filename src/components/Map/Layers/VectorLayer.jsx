import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import OLVectorLayer from "ol/layer/Vector";
import { LensBlurTwoTone } from "@mui/icons-material";
import { Style, Icon, Fill, Stroke, Circle, Image, Text } from "ol/style";

const VectorLayer = ({ source, style, zIndex = 1, opacity = 1, declutter = true, showLabels = false}) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    let vectorLayer, styles = [], labelStyle;

    if(style) styles.push(new Style({
      stroke: new Stroke({
        width: style.strokeWidth,
        color: style.stroke.hex8,
      }),
      fill: new Fill({
        color: style.fill.hex8,
      })
    }));

    if(showLabels){ // with text labels
      labelStyle = new Style({
        text: new Text({
          font: style.labelStyle.fontWeight+' '+style.labelStyle.fontSize+' Calibri,sans-serif',
          overflow: true,
          fill: new Fill({
            color: style.labelStyle.color,
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 3,
          }),
        })
      });
      styles.push(labelStyle);
      vectorLayer = new OLVectorLayer({
        source: source,
        style: function (feature) {
          let columnName = 'ADM1_EN';
          if(!feature.get(columnName)) columnName = 'ADM0_EN';
          const label = feature.get(columnName).split(' ').join('\n');
          labelStyle.getText().setText(label);
          return styles;
        },
        declutter: true
      });
    } else { // no text labels
      vectorLayer = new OLVectorLayer({
        source: source,
        style: styles
      });
    }




    map.addLayer(vectorLayer);
    vectorLayer.setZIndex(zIndex);
    vectorLayer.setOpacity(opacity);
    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source, zIndex]);

  return null;
};

export default VectorLayer;

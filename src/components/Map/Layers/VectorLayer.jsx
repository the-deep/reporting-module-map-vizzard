import { useContext, useEffect } from "react";
import OLVectorLayer from "ol/layer/Vector";
import { Style, Icon, Fill, Stroke, Circle, Image, Text } from "ol/style";
import { rgba } from "../../MapVizzard/MapOptions/ColorPicker";
import MapContext from "../MapContext";

const VectorLayer = ({
  source,
  style,
  zIndex = 1,
  opacity = 1,
  declutter = true,
  showLabels = false,
  labelColumn = "",
}) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;
    let vectorLayer,
      styles = [],
      labelStyle;

    if (style)
      styles.push(
        new Style({
          stroke: new Stroke({
            width: style.strokeWidth,
            color: rgba(style.stroke),
          }),
          fill: new Fill({
            color: rgba(style.fill),
          }),
        })
      );

    if (showLabels && labelColumn) {
      // with text labels
      labelStyle = new Style({
        text: new Text({
          font:
            style.labelStyle.fontWeight +
            " " +
            style.labelStyle.fontSize +
            " Calibri,sans-serif",
          overflow: true,
          fill: new Fill({
            color: style.labelStyle.color,
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 3,
          }),
        }),
      });
      styles.push(labelStyle);
      vectorLayer = new OLVectorLayer({
        source: source,
        style: function (feature) {
          let columnName = labelColumn;
          if (!feature.get(columnName)) columnName = labelColumn;
          const label = String(feature.get(columnName)).split(" ").join("\n");
          labelStyle.getText().setText(label);
          return styles;
        },
        declutter: true,
      });
    } else {
      // no text labels
      vectorLayer = new OLVectorLayer({
        source: source,
        style: styles,
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

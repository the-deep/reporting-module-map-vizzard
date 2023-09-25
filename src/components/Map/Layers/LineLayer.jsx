import { useEffect, useState } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Stroke,
} from 'ol/style';
import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';

function LineLayer({
  map,
  source,
  style,
  zIndex = 1,
  opacity = 1,
}) {
  const [lineLayer, setLineLayer] = useState(undefined);

  // line vectors
  useEffect(() => {
    if (!map) return undefined;
    const styles = [];

    let lineDash = null;

    if (style.strokeType === 'dash') {
      lineDash = [(style.dashSpacing / 3), style.dashSpacing];
    }

    const stroke = new Stroke({
      width: style.strokeWidth,
      color: rgba(style.stroke),
      lineDash,
    });

    if (style) {
      styles.push(
        new Style({ stroke }),
      );
    }

    const vLayer = new OLVectorLayer({
      source,
      style() {
        return styles;
      },
    });

    map.addLayer(vLayer);
    vLayer.setZIndex(zIndex);
    vLayer.setOpacity(opacity);
    setLineLayer(vLayer);

    return () => {
      if (map) {
        map.removeLayer(vLayer);
      }
    };
  }, [map, JSON.stringify(style)]);

  useEffect(() => {
    if (!lineLayer) return;
    lineLayer.setOpacity(opacity);
  }, [lineLayer, opacity]);

  useEffect(() => {
    if (!lineLayer) return;
    lineLayer.setZIndex(zIndex);
  }, [lineLayer, zIndex]);

  return null;
}

export default LineLayer;

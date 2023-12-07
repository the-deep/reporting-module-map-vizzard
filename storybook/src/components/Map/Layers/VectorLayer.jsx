import { useEffect, useState, useMemo } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
  Style,
  Fill,
  Stroke,
  Text,
} from 'ol/style';
import FillPattern from 'ol-ext/style/FillPattern';
import * as d3 from 'd3';
import * as d3ColorScale from 'd3-scale-chromatic';
import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';

function VectorLayer({
  map,
  source,
  style,
  zIndex = 1,
  opacity = 1,
  showLabels = false,
  labelColumn = '',
}) {
  const [vectorLayer, setVectorLayer] = useState(undefined);
  const [labelLayer, setLabelLayer] = useState(undefined);

  const colorsArray = useMemo(() => {
    if (!style.fillPalette) return [];
    let colors;
    if ((style.fillType === 'graduated') || (style.fillType === 'continuous')) {
      const interpolator = d3ColorScale[`interpolate${style.fillPalette}`];
      let numSteps = style.fillSteps;
      if (style.fillScaleType === 'continuous') numSteps = 50;
      // eslint-disable-next-line
      colors = Array.from({ length: numSteps }, (_, i) => interpolator(i * (1 / numSteps)));
    } else if (style.fillType === 'categorical') {
      colors = {};
      let i = 0;
      let palette = d3ColorScale[`scheme${style.fillPaletteCategorised}`];
      if ((style.fillScaleInvert) && (typeof palette !== 'undefined')) {
        palette = [...palette].reverse();
      }
      source.forEachFeature((d) => {
        // eslint-disable-next-line
        const index = d['values_'][style.fillColumn];
        if (typeof palette !== 'undefined') {
          colors[index] = palette[i];
          i += 1;
          if (i === palette.length) i = 0;
        }
      });
    } else {
      colors = d3ColorScale[`scheme${style.fillPalette}`];
    }
    if ((style.fillScaleInvert) && (style.fillType !== 'categorical')) colors.reverse();

    return colors;
  }, [
    source,
    style.fillPalette,
    style.fillPaletteCategorised,
    style.fillScaleInvert,
    style.fillType,
    style.fillSteps,
    style.fillScaleType,
    style.fillColumn,
  ]);

  // polygon vectors
  useEffect(() => {
    if (!map) return undefined;
    const styles = [];
    let polygonStyle;
    let numSteps = style.fillSteps;
    let { fillPow } = style;
    if (style.fillScaleType === 'continuous') numSteps = 50;
    if (style.fillScaleType === 'steps') fillPow = 1;

    let fill = new Fill({
      color: rgba(style.fill),
    });

    const stroke = new Stroke({
      width: style.strokeWidth,
      color: rgba(style.stroke),
    });

    if (style.fillType === null) {
      fill = null;
    }

    if (style.fillSingleType === 'pattern') {
      fill = new FillPattern({
        pattern: 'hatch',
        color: rgba(style.fill),
        size: style.fillPatternSize,
        spacing: style.fillPatternSpacing,
        angle: style.fillPatternAngle,
      });
    }

    if (style) {
      styles.push(
        (polygonStyle = new Style({ stroke, fill })),
      );
    }

    const colorsArrayPow = d3.scalePow()
      .exponent(fillPow)
      .domain([0, numSteps]);

    const colorScale = d3
      .scaleLinear()
      .range([0, numSteps])
      .domain([style.fillDataMin, style.fillDataMax]);

    let colorStrPow = null;
    if (style.fillType === 'categorical') {
      colorStrPow = null;
    } else {
      colorStrPow = colorsArray.map((c, i) => {
        const colorIndex = Math.ceil(colorsArrayPow(i) * numSteps);
        return (colorsArray[colorIndex]);
      });
    }

    const vLayer = new OLVectorLayer({
      source,
      style(feature) {
        // FILL LOGIC
        if (style.fillType === 'graduated') {
          const colorArrayIndex = Math.floor(colorScale(feature.get(style.fillColumn))) - 1;
          const polygonColor = colorStrPow[colorArrayIndex];
          if (typeof polygonColor !== 'undefined') {
            polygonStyle.getFill().setColor(polygonColor);
          } else {
            polygonStyle.getFill().setColor('transparent');
          }
        }
        if (style.fillType === 'categorical') {
          const polygonColor = colorsArray[feature.get(style.fillColumn)];
          if (typeof polygonColor !== 'undefined') {
            polygonStyle.getFill().setColor(polygonColor);
          } else {
            polygonStyle.getFill().setColor('transparent');
          }
        }
        return styles;
      },
    });

    map.addLayer(vLayer);
    vLayer.setZIndex(zIndex);
    vLayer.setOpacity(opacity);
    setVectorLayer(vLayer);

    return () => {
      if (map) {
        map.removeLayer(vLayer);
      }
    };
  }, [map, JSON.stringify(style)]);

  // text labels
  useEffect(() => {
    if (!map) return undefined;
    const labelStyles = [];
    let labelStyle;

    if (showLabels && labelColumn) {
      // with text labels
      let stroke = new Stroke({
        color: 'rgba(255,255,255,0.5)',
        width: 2,
      });
      if (style.labelStyle.showHalo === false) stroke = null;
      labelStyle = new Style({
        text: new Text({
          font: `${style.labelStyle.fontWeight} ${style.labelStyle.fontSize}px/1.07 ${style.labelStyle.fontFamily},sans-serif`,
          overflow: true,
          fill: new Fill({
            color: rgba(style.labelStyle.color),
          }),
          stroke,
        }),
      });
      labelStyles.push(labelStyle);
    }

    const textLayer = new OLVectorLayer({
      source,
      style(feature) {
        if (showLabels && labelColumn) {
          let columnName = labelColumn;
          if (!feature.get(columnName)) columnName = labelColumn;
          let label = String(feature.get(columnName)).split(' ').join('\n');
          if (style.labelStyle.transform === 'uppercase') label = label.toUpperCase();
          labelStyle.getText().setText(label);
        }
        return labelStyles;
      },
      declutter: true,
    });

    map.addLayer(textLayer);
    textLayer.setZIndex(zIndex);
    textLayer.setOpacity(opacity);
    setLabelLayer(textLayer);

    return () => {
      if (map) {
        map.removeLayer(textLayer);
      }
    };
  }, [map, showLabels, labelColumn, JSON.stringify(style)]);

  useEffect(() => {
    if (!vectorLayer) return;
    vectorLayer.setOpacity(opacity);
  }, [vectorLayer, opacity]);

  useEffect(() => {
    if (!labelLayer) return;
    labelLayer.setOpacity(opacity);
  }, [labelLayer, opacity]);

  useEffect(() => {
    if (!vectorLayer) return;
    vectorLayer.setZIndex(zIndex);
  }, [vectorLayer, zIndex]);

  useEffect(() => {
    if (!labelLayer) return;
    labelLayer.setZIndex(zIndex);
  }, [labelLayer, zIndex]);

  return null;
}

export default VectorLayer;

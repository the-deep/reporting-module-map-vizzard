import { useEffect, useState } from 'react';
import { Heatmap } from 'ol/layer';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import * as d3ColorScale from 'd3-scale-chromatic';
import { scaleLog } from 'd3-scale';
import { vector } from '../helpers';

function HeatmapLayer({
  map,
  data,
  zIndex = 1,
  opacity = 1,
  blur,
  radius,
  fillPalette,
  weighted = false,
  scaleMax = 350,
}) {
  const [heatmapLayer, setHeatmapLayer] = useState(undefined);

  const scaleWeight = scaleLog()
    .domain([1, scaleMax])
    .range([0.4, 1]);

  useEffect(() => {
    if (!map) return undefined;

    let points = data;

    if (!Array.isArray(data)) {
      points = data.features;
    }

    if (typeof points === 'undefined') return undefined;

    const features = points.map((row) => {
      let item = row;
      if (!Array.isArray(data)) {
        item = row.properties;
        [item.lon, item.lat] = row.geometry.coordinates;
      }
      const feature = new Feature(new Point(fromLonLat([item.lon, item.lat])));
      feature.setProperties(item);
      return feature;
    });

    // const vectorLayer = new OLVectorLayer({
    //   source: vector({ features }),
    //   renderers: ['SVG', 'VML', 'Canvas'],
    // });

    if (map) {
      map.removeLayer(heatmapLayer);
    }

    const interpolator = d3ColorScale[`interpolate${fillPalette}`];
    const numSteps = 5;
    // eslint-disable-next-line
    const colors = Array.from({ length: numSteps }, (_, i) => interpolator(i * (1 / numSteps)));

    const vectorLayer = new Heatmap({
      source: vector({ features }),
      blur,
      radius,
      gradient: colors,
      weight: (feature) => {
        if (weighted) {
          const w = scaleWeight(parseFloat(feature.get('fatalities'))) || 0;
          return w;
        }
        return 0.7;
      },
    });
    map.addLayer(vectorLayer);
    // vectorLayer.setZIndex(zIndex);
    // vectorLayer.setOpacity(opacity);
    setHeatmapLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [
    map,
    fillPalette,
    weighted,
    // scaleColumn,
    // scaleDataMin,
    // scaleDataMax,
  ]);

  useEffect(() => {
    if (!heatmapLayer) return;
    heatmapLayer.getSource().clear();
    let points = data;

    if (!Array.isArray(data)) {
      points = data.features;
    }

    if (typeof points === 'undefined') return;

    // filter out exclusions
    points = points.filter((d) => !d.exclude_from_heatmap);

    const features = points.map((row) => {
      let item = row;
      if (!Array.isArray(data)) {
        item = row.properties;
        [item.lon, item.lat] = row.geometry.coordinates;
      }
      const feature = new Feature(new Point(fromLonLat([item.lon, item.lat])));
      feature.setProperties(item);
      return feature;
    });
    heatmapLayer.getSource().addFeatures(features);

    // heatmapLayer.setOpacity(opacity);
  }, [heatmapLayer, JSON.stringify(data)]);

  useEffect(() => {
    if (!heatmapLayer) return;
    heatmapLayer.setOpacity(opacity);
  }, [heatmapLayer, opacity]);

  useEffect(() => {
    if (!heatmapLayer) return;
    heatmapLayer.setZIndex(zIndex);
  }, [heatmapLayer, zIndex]);

  useEffect(() => {
    if (!heatmapLayer) return;
    heatmapLayer.setBlur(blur);
  }, [heatmapLayer, blur]);

  useEffect(() => {
    if (!heatmapLayer) return;
    heatmapLayer.setRadius(radius);
  }, [heatmapLayer, radius]);

  return null;
}

export default HeatmapLayer;

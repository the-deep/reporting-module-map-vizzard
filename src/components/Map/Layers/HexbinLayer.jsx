import { useEffect, useState } from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import HexBin from 'ol-ext/source/HexBin';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {
  Style,
  Fill,
} from 'ol/style';
import { fromLonLat } from 'ol/proj';
import * as d3ColorScale from 'd3-scale-chromatic';
import { scaleLog } from 'd3-scale';
// import { rgba } from '../../MapVizzard/MapOptions/ColorPicker';
import { vector } from '../Source';

function HexbinLayer({
  map,
  data,
  zIndex = 1,
  opacity = 1,
  radius,
  fillPalette,
  weighted = false,
}) {
  const [hexbinLayer, setHexbinLayer] = useState(undefined);
  const [vectorLayer, setVectorLayer] = useState(undefined);
  const [max, setMax] = useState();
  const [maxFatalities, setMaxFatalities] = useState();
  const interpolator = d3ColorScale[`interpolate${fillPalette}`];
  const numSteps = 5;
  // eslint-disable-next-line
  const colors = Array.from({ length: numSteps }, (_, i) => interpolator(i * (1 / numSteps)));

  useEffect(() => {
    if (!map) return undefined;

    let points = data;

    if (!Array.isArray(data)) {
      points = data.features;
    }

    if (typeof points === 'undefined') return undefined;

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

    const hexBinLayer = new HexBin({
      source: vector({ features }),
      size: 7000 * radius,
    });

    const hexFeatures = hexBinLayer.getFeatures();
    // Calculate min/ max value
    let newMin = Infinity;
    let newMax = 0;
    let newMaxFatalities = 0;

    // eslint-disable-next-line no-cond-assign, no-plusplus
    for (let i = 0, f; f = hexFeatures[i]; i++) {
      const arr = f.get('features');
      const n = arr.length;
      let fatalities = 0;
      let nSdn = 0;
      arr.forEach((feature) => {
        // eslint-disable-next-line
        const iso = feature.values_.adm0_iso3;
        // eslint-disable-next-line
        if (iso === 'SDN') fatalities += feature.values_.fatalities;
        if (iso === 'SDN') nSdn += 1;
      });
      if (n < newMin) newMin = n;
      if (nSdn > newMax) newMax = nSdn;
      if (fatalities > newMaxFatalities) newMaxFatalities = fatalities;
      hexFeatures[i].set('fatalities', fatalities);
    }
    // maxi = max;
    // setMin(newMin);
    setMax(newMax);
    setMaxFatalities(newMaxFatalities);
    setHexbinLayer(hexBinLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [
    map,
    fillPalette,
    weighted,
    radius,
    JSON.stringify(data),
  ]);

  useEffect(() => {
    if (!hexbinLayer) return undefined;

    const styleFn = (f) => {
      const val = f.get('features').length;
      const ff = f.get('fatalities');
      let color;
      if (weighted) {
        const scaleColor = scaleLog()
          .domain([1, maxFatalities])
          .range([0, 4])
          .base(2)
          .clamp(true);
        const colorIndex = Math.ceil(scaleColor(ff));
        if (Number.isNaN(colorIndex)) {
          color = 'rgba(255,255,255,0)';
        } else {
          color = colors[colorIndex];
        }
      } else {
        const scaleColor = scaleLog()
          .domain([1, max])
          .range([0, 4])
          .base(2)
          .clamp(true);
        const colorIndex = Math.ceil(scaleColor(val));
        color = colors[colorIndex];
      }
      return [new Style({ fill: new Fill({ color }) })];
    };

    const vLayer = new OLVectorLayer({
      source: hexbinLayer,
      renderers: ['SVG', 'VML', 'Canvas'],
      style: styleFn,
    });
    vLayer.setZIndex(zIndex);

    map.addLayer(vLayer);
    setVectorLayer(vLayer);

    return () => {
      if (map) {
        map.removeLayer(vLayer);
      }
    };
  }, [hexbinLayer, weighted]);

  useEffect(() => {
    if (!hexbinLayer) return;
    vectorLayer.setOpacity(opacity);
  }, [opacity]);

  useEffect(() => {
    if (!vectorLayer) return;
    vectorLayer.setZIndex(zIndex);
  }, [zIndex]);

  // useEffect(() => {
  //   if (!hexbinLayer) return;
  //   hexbinLayer.setSize(7000 * radius);
  // }, [radius]);

  return null;
}

export default HexbinLayer;

import OLVectorLayer from 'ol/layer/Vector';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';
import { Draw, Modify, Snap } from 'ol/interaction';
import MultiPoint from 'ol/geom/MultiPoint';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source';
import {
  Style, Fill, Stroke, Circle,
} from 'ol/style';
import { transform } from 'ol/proj';
import TextField from '@mui/material/TextField';
import {
  FormControl,
} from '@mui/material';
import styles from './MapOptions.module.css';
import mask from '../assets/mask.svg';

function OptionsMask({
  layer, activeLayer, updateLayer, map,
}) {
  const theme = createTheme({
    palette: {
      primary: grey,
    },
  });
  const layerClone = { ...layer };

  const updateAttr = (attr, val) => {
    layerClone[attr] = val;
    updateLayer(layerClone, activeLayer);
  };

  let draw; let snap; let
    modify;

  map.getLayers().forEach((el) => {
    // eslint-disable-next-line no-underscore-dangle
    if (el && el.values_.id === 'drawLayerMask') {
      map.removeLayer(el);
    }
  });

  map.getLayers().forEach(function (el) {
    // eslint-disable-next-line no-underscore-dangle
    if (el.values_.id && el.values_.id === activeLayer) {
      const image = new Circle({
        radius: 4,
        fill: new Fill({
          color: 'grey',
        }),
        stroke: new Stroke({ color: 'white', width: 1.5 }),
      });

      const drawLayerStyle = [
        new Style({
          image,
          geometry(feature) {
            const coordinates = feature.getGeometry().getCoordinates()[1];
            const coords = [];
            coordinates.forEach((d) => {
              coords.push(transform(d, 'EPSG:3857', 'EPSG:3857'));
            });
            return new MultiPoint(coords);
          },
        }),
        new Style({
          stroke: new Stroke({
            width: 1,
            color: '#a3a0a0',
            lineDash: [2, 4],
          }),
          fill: new Fill({
            color: 'transparent',
          }),
        }),
      ];

      const polygon = layerClone.mask;

      const source = new VectorSource({ wrapX: false });

      const drawLayer = new OLVectorLayer({
        source,
        style: drawLayerStyle,
        id: 'drawLayerMask',
      });

      drawLayer.setZIndex(1000);

      if (polygon) {
        const format = new WKT();
        const wkt = format.readGeometry(polygon, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        const feature = new Feature(wkt);
        source.addFeature(feature);
        map.addLayer(drawLayer);
      }

      map.getInteractions().forEach((interaction) => {
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
        source,
        type: 'Polygon',
      });
      map.addInteraction(draw);

      // hide/show draw cursor on mouseout
      map.getViewport().addEventListener(
        'mouseout',
        () => {
          draw.setActive(false);
        },
        false,
      );

      map.getViewport().addEventListener(
        'mouseover',
        () => {
          draw.setActive(true);
        },
        false,
      );

      modify = new Modify({ source });
      snap = new Snap({ source });

      map.addInteraction(modify);
      map.addInteraction(snap);

      modify.on('modifyend', (evt) => {
        const collection = evt.features;
        const feature = collection.item(0);
        const format = new WKT();
        const wkt = format.writeGeometry(feature.getGeometry(), {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857',
        });
        layerClone.mask = wkt;
        updateLayer(layerClone, activeLayer);
      });

      draw.on('drawstart', () => {
        source.clear();
      });

      source.on(
        'addfeature',
        (feature) => {
          const format = new WKT();
          const wkt = format.writeGeometry(feature.feature.getGeometry(), {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
          });
          const b = '(0 90,180 90,180 -90,0 -90,-180 -90,-180 0,-180 90,0 90),';
          const position = 8;
          const invertedPolygon = [
            wkt.slice(0, position),
            b,
            wkt.slice(position),
          ].join('');
          layerClone.mask = invertedPolygon;
          layerClone.opacity = 1;
          updateLayer(layerClone, activeLayer);
        },
        this,
      );
    }
  });

  return (
    <div>
      <div className={styles.mapOptionsPanel}>
        <h1>
          <div className={styles.mapOptions_icon}>
            <img src={mask} alt="" />
          </div>
          Mask Options
        </h1>
      </div>
      <div className={styles.mapOptionsPanelBody}>
        <div className={styles.optionsPanel}>
          <div className={styles.optionRow}>
            <FormControl fullWidth>
              <TextField
                label="Layer name"
                variant="standard"
                value={layerClone.name}
                onChange={(e) => updateAttr('name', e.target.value)}
              />
            </FormControl>
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Opacity</div>
            <Slider
              aria-label="Opacity"
              value={layerClone.opacity}
              size="small"
              onChange={(e, val) => updateAttr('opacity', val)}
              valueLabelDisplay="auto"
              step={0.01}
              color="primary"
              theme={theme}
              min={0}
              max={1}
            />
          </div>

          <hr />

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Blur radius</div>
            <Slider
              aria-label="Blur radius"
              value={layerClone.blur}
              size="small"
              onChange={(e, val) => updateAttr('blur', val)}
              valueLabelDisplay="auto"
              step={1}
              color="primary"
              theme={theme}
              min={0}
              max={20}
            />
          </div>

          <div className={styles.optionRow}>
            <div className={styles.optionLabel}>Smoothing</div>
            <Slider
              aria-label="Smoothing"
              value={layerClone.smoothing}
              size="small"
              onChange={(e, val) => updateAttr('smoothing', val)}
              valueLabelDisplay="auto"
              step={0.01}
              color="primary"
              theme={theme}
              min={0}
              max={1}
            />
          </div>

          <br />
          <br />
        </div>
      </div>
    </div>
  );
}

export default OptionsMask;

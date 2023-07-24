import { useContext, useEffect } from 'react';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Style, Fill } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import OLVectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import filters from '../filters.module.css';

function MaskLayer({
  map, id, polygon, source, blur, zIndex = 1, opacity = 1,
}) {
  useEffect(() => {
    if (!map) return;

    const style = new Style({
      fill: new Fill({
        color: '#FFF',
      }),
    });

    const vectorLayer = new OLVectorLayer({
      source,
      style,
      className: `${filters.blur} ${filters[`blur${blur}`]}`,
      id,
    });

    if (polygon) {
      const format = new WKT();
      const wkt = format.readGeometry(polygon, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
      const feature = new Feature(wkt);
      source.addFeature(feature);
      map.addLayer(vectorLayer);
    }

    vectorLayer.setZIndex(zIndex);
    vectorLayer.setOpacity(opacity);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source, zIndex, polygon, opacity, blur]);

  return null;
}

export default MaskLayer;

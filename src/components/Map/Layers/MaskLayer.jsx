import { useEffect } from 'react';
import { Style, Fill } from 'ol/style';
import OLVectorLayer from 'ol/layer/Vector';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Cspline from 'ol-ext/render/Cspline';
import filters from '../filters.module.css';

function MaskLayer({
  map, id, polygon, source, blur, zIndex = 1, opacity = 1, smoothing,
}) {
  useEffect(() => {
    if (!map) return undefined;

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
      feature.setGeometry(feature.getGeometry().cspline({ tension: smoothing }));
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
  }, [map, source, zIndex, polygon, opacity, blur, smoothing]);

  return null;
}

export default MaskLayer;

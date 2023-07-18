import { useContext, useEffect } from "react";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { Style, Fill } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import OLVectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";
import WKT from 'ol/format/WKT.js';
import Feature from 'ol/Feature';
import MapContext from "../MapContext";
import filters from '../filters.module.css';

const MaskLayer = ({ id, polygon, source, blur, zIndex = 1, opacity = 1 }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let style = new Style({
      fill: new Fill({
        color: "#FFF",
      }),
    });

    let vectorLayer = new OLVectorLayer({
      source,
      style,
      className: `${filters.blur} ${filters['blur'+blur]}`,
      id: id
    });

    if(polygon){
      var format = new WKT(),
      wkt = format.readGeometry(polygon,{dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
      var feature = new Feature(wkt);
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
};

export default MaskLayer;
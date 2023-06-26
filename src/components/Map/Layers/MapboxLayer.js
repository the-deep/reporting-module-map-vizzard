import { useContext, useEffect } from "react";
import MapContext from "../MapContext";
import Layer from "ol/layer/Layer";
import Source from "ol/source/Source";
import Map from 'ol/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxVector from 'ol/layer/MapboxVector';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { toLonLat, get } from "ol/proj";
 
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';

const MapboxLayer = ({ source, style, zIndex = 1, opacity = 1}) => {

  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let mbLayer = new MapboxVector({
      styleUrl: 'mapbox://styles/matthewsmawfield/clidxtx3j003p01r0cetzc9iv',
      attributionControl: true,
      scrollZoom: false,
      accessToken: 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ',
    });

    map.addLayer(mbLayer);
    mbLayer.setZIndex(zIndex);
    mbLayer.setOpacity(opacity);

    return () => {
      if (map) {
        // console.log('remove mbLayer');
        map.removeLayer(mbLayer);
      }
    };
  }, [JSON.stringify(source.urls)]);

  // useEffect(() => {
  //   // if (!map) return;
  //   console.log('z changed');
  //   // return () => {
  //     // if (map) {
  //       // map.removeLayer(mbLayer);
  //     // }
  //   // };
  // }, [zIndex]);

  // useEffect(() => {
  //   if (!map) return;
  //   console.log('opacity changed');

  //   return () => {
  //     if (map) {
  //       // map.removeLayer(mbLayer);
  //     }
  //   };
  // }, [opacity]);

  return null;

};

export default MapboxLayer;
import React from 'react';
import Map from '../components/Map';
import mapConfig from "../components/MapVizzard/config.json";

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';


// Story Config
export default {
  title: 'Map',
  component: Map,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'number', description: 'Viewbox height in pixels', table: {type: {summary: 'number'}}},
    zoom: { control: 'number', description: 'Initial zoom level', table: {type: {summary: 'number'}}},
    center: {  description: 'Viewbox centre coordinates', table: {type: {summary: 'array [lon,lat]'}} },
    mainTitle: {  description: 'Main map title', table: {type: {summary: 'string'}} },
    subTitle: {  description: 'Map sub-title', table: {type: {summary: 'string'}} },
    layers: {  control: 'object', description: 'layers object', table: {type: {summary: 'JSON object'}} },
    showScale: {  control: 'boolean', description: 'show scale', table: {type: {summary: 'boolean'}} },

    // symbolSize: { control: 'number', description: 'Symbol point radius size in pixels', table: {type: {summary: 'number'}}},
    children: { table: { disable: true}}
  }
};


export const Default = {
  args: {
    center: mapConfig.mapOptions.center,
    zoom: mapConfig.mapOptions.zoom,
    layers: mapConfig.layers,
    height: mapConfig.mapOptions.height,
    width: mapConfig.mapOptions.width,
    mainTitle: 'Main title',
    subTitle: 'Sub-title',
    showScale: mapConfig.mapOptions.showScale,
    scaleUnits: mapConfig.mapOptions.scaleUnits,
    scaleBar: mapConfig.mapOptions.scaleBar,
    scaleBarPosition: mapConfig.mapOptions.scaleBarPosition,
    enableMouseWheelZoom: mapConfig.mapOptions.enableMouseWheelZoom,
    enableZoomControls: mapConfig.mapOptions.enableZoomControls,
    zoomControlsPosition: mapConfig.mapOptions.zoomControlsPosition,
  },
};


// showScale={mapOptions.showScale}
//           scaleUnits={mapOptions.scaleUnits}
//           scaleBar={mapOptions.scaleBar}
//           scaleBarPosition={mapOptions.scaleBarPosition}
//           enableMouseWheelZoom={mapOptions.enableMouseWheelZoom}
//           enableZoomControls={mapOptions.enableZoomControls}
//           zoomControlsPosition={mapOptions.zoomControlsPosition}
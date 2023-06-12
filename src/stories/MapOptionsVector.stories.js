import React from 'react';
import MapOptions from '../components/MapOptions';
import mapConfig from "../components/MapVizzard/config.json";

// import Plugin from '../packages/MapboxAnimatorPlugin';

// eslint-disable-next-line prefer-destructuring

// also just wrapping a functional component can be done real simply
// and as needed.
// const PluginWithMap = withMap( ( props ) => {
//   console.log( 'PluginWithMap', props );
//   return (
//     <div>simple component</div>
//   );
// } );

// Story Config
export default {
  title: 'Layer Options/Vector',
  component: MapOptions,
  tags: ['autodocs'],
  argTypes: {
    // height: { control: 'number', description: 'Viewbox height in pixels', table: {type: {summary: 'number'}}},
    // zoom: { control: 'number', description: 'Initial zoom level', table: {type: {summary: 'number'}}},
    // center: {  description: 'Viewbox centre coordinates', table: {type: {summary: 'array [lon,lat]'}} },
    // mainTitle: {  description: 'Main map title', table: {type: {summary: 'string'}} },
    // subTitle: {  description: 'Map sub-title', table: {type: {summary: 'string'}} },
    // layers: {  control: 'object', description: 'layers object', table: {type: {summary: 'JSON object'}} },
    // // symbolSize: { control: 'number', description: 'Symbol point radius size in pixels', table: {type: {summary: 'number'}}},
    children: { table: { disable: true}}
  }
};

export const Default = {
  args: {
    // center: [30.21, 15.86],
    // config: 5,
    layers: mapConfig.layers,
    activeLayer: 14,
    // height: 400,
    // mainTitle: 'Main title',
    // subTitle: 'Sub-title',
    
  },
};
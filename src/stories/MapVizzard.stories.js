import React from 'react';
import MapVizzard from '../components/MapVizzard';
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
  title: 'Map Vizzard',
  component: MapVizzard,
  tags: ['autodocs'],
  argTypes: {
    mapConfig: {  control: 'object', description: 'layers object', table: {type: {summary: 'JSON object'}} },
    children: { table: { disable: true}}
  }
};


export const Default = {
  args: {
    mapConfig: mapConfig,
  },
};
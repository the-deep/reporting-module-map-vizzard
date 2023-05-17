import React from 'react';
import Map from '../components/Map';
// import Plugin from '../packages/MapboxAnimatorPlugin';

// eslint-disable-next-line prefer-destructuring
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';

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
  title: 'Map',
  component: Map,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'number' },
    zoom: { control: 'number' },
  }
};


export const Default = {
  args: {
    center: [30.21, 15.86],
    zoom: 5,
    height: 400
  },
};
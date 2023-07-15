import React from 'react';
import MapOptions from '../components/MapVizzard/MapOptions';
import mapConfig from "./mapConfig.json";

// Story Config
export default {
  title: 'Map Vizzard/Layer options panel/Symbol',
  component: MapOptions,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true}}
  }
};

export const Default = {
  args: {
    layers: mapConfig.layers,
    activeLayer: 12
  }
};
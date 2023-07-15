import React from 'react';
import MapOptions from '../components/MapOptions';
import mapConfig from "./mapConfig.json";

// Story Config
export default {
  title: 'Layer Options/Mapbox',
  component: MapOptions,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true}}
  }
};

export const Default = {
  args: {
    layers: mapConfig.layers,
    activeLayer: 11
  }
};
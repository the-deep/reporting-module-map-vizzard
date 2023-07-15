import React from 'react';
import {MapLayers} from '../components/MapLayers/MapLayers';
import mapConfig from "./mapConfig.json";

// Story Config
export default {
  title: 'Layers panel',
  component: MapLayers,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true}}
  }
};

export const Default = {
  args: {
    layers: mapConfig.layers,
  }
};
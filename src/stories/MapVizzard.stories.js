import React from 'react';
import MapVizzard from '../components/MapVizzard';
import mapConfig from './mapConfig.json';

// Story Config
export default {
  title: 'Map Vizzard/Map Vizzard',
  component: MapVizzard,
  tags: ['autodocs'],
  argTypes: {
    mapConfig: { control: 'object', description: 'layers object', table: { type: { summary: 'JSON object' } } },
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    mapConfig,
  },
};

import { Map } from '@the-deep/reporting-module-components';

import defaultConfig from './default.json';
import sudanMapConfig from './sudan.json';
import ukraineMapConfig from './ukraine.json';
import darfurMapConfig from './darfur.json';

import heatmapOptions from './heatmap.json';
import symbolOptions from './symbol.json';

// Story Config
export default {
  title: 'Map/Map',
  component: Map,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'number', description: 'Viewbox height in pixels', table: { type: { summary: 'number' } } },
    zoom: { control: 'number', description: 'Initial zoom level', table: { type: { summary: 'number' } } },
    center: { description: 'Viewbox centre coordinates', table: { type: { summary: 'array [lon,lat]' } } },
    mainTitle: { description: 'Main map title', table: { type: { summary: 'string' } } },
    subTitle: { description: 'Map sub-title', table: { type: { summary: 'string' } } },
    layers: { control: 'object', description: 'layers object', table: { type: { summary: 'JSON object' } } },
    showScale: { control: 'boolean', description: 'show scale', table: { type: { summary: 'boolean' } } },
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    ...defaultConfig.mapOptions,
    center: {
      lon: 30,
      lat: 16.8,
    },
    zoom: 5.6,
    layers: [
      {
        id: 1,
        name: 'OSM background',
        type: 'osm',
        visible: true,
        options: {
          opacity: 1,
          zIndex: 1,
        },
      },
      {
        id: 11,
        type: 'mapbox',
        visible: true,
        options: {
          opacity: 0.6,
          zIndex: 2,
          styleUrl: 'mapbox://styles/matthewsmawfield/clidxtx3j003p01r0cetzc9iv',
          accessToken: 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ',
        },
      },
      {
        id: 15,
        type: 'heatmap',
        visible: true,
        options: heatmapOptions,
      },
      {
        id: 15,
        type: 'symbol',
        visible: true,
        options: symbolOptions,
      },
    ],
  },
};

export const Sudan = {
  args: {
    ...sudanMapConfig.mapOptions,
    layers: sudanMapConfig.layers,
  },
};

export const Ukraine = {
  args: {
    ...ukraineMapConfig.mapOptions,
    layers: ukraineMapConfig.layers,
  },
};

export const Darfur = {
  args: {
    ...darfurMapConfig.mapOptions,
    layers: darfurMapConfig.layers,
  },
};

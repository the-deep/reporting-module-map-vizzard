import Map from '../components/Map';

import defaultConfig from './default.json';
import sudanMapConfig from './sudan.json';
import ukraineMapConfig from './ukraine.json';
import darfurMapConfig from './darfur.json';

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
    layers: defaultConfig.layers,
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

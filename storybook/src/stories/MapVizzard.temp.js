import MapVizzard from '../components/MapVizzard';

import defaultConfig from './default.json';
import sudanMapConfig from './sudan.json';
import ukraineMapConfig from './ukraine.json';
import darfurMapConfig from './darfur.json';

// Story Config
export default {
  title: 'Map/Map Vizzard',
  component: MapVizzard,
  tags: ['autodocs'],
  argTypes: {
    mapConfig: {
      control: 'object',
      description: 'layers object',
      table: { type: { summary: 'JSON object' } },
    },
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    mapConfig: defaultConfig,
  },
};

export const Sudan = {
  args: {
    mapConfig: sudanMapConfig,
  },
};

export const Ukraine = {
  args: {
    mapConfig: ukraineMapConfig,
  },
};

export const Darfur = {
  args: {
    mapConfig: darfurMapConfig,
  },
};

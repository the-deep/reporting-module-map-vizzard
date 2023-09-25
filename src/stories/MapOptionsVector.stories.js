import MapOptions from '../components/MapVizzard/MapOptions';
import mapConfig from './sudan.json';

// Story Config
export default {
  title: 'Map Vizzard/Layer options panel/Vector',
  component: MapOptions,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    layers: mapConfig.layers,
    activeLayer: 14,
  },
};

import MapLayers from '../components/MapVizzard/MapLayers/MapLayers';
import mapConfig from './sudan.json';

// Story Config
export default {
  title: 'Map Vizzard/Layers panel',
  component: MapLayers,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    layers: mapConfig.layers,
  },
};
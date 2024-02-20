import Timeline from '../components/Timeline/Timeline';
import data from './Timeline.json';

// Story Config
export default {
  title: 'Timeline/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    data,
  },
};

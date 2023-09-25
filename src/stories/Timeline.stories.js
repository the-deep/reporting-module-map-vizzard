import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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

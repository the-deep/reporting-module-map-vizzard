import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import KPIs from '../components/KPIs/KPIs';
import data from './KPIs.json';

// Story Config
export default {
  title: 'KPIs/KPIs',
  component: KPIs,
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

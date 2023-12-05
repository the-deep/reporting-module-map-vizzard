import { KPIs } from '@the-deep/reporting-module-components';

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

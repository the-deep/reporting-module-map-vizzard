import { Timeline } from '@the-deep/reporting-module-components';

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

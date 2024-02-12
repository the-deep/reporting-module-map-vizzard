// eslint-disable-next-line
import { LineChart } from '@the-deep/reporting-module-components';

import lineChartData from './LineChart.json';

const { data } = lineChartData;

// Story Config
export default {
  title: 'LineChart/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
  },
};

export const Default = {
  args: {
    width: 500,
    height: 500,
    showTooltips: true,
    valueLabel: 'IDPs',
    color: 'purple',
    fontFamily: 'Barlow Condensed',
    fontColor: 'black',
    fontSize: 10,
    yAxisPosition: 'right',
    yAxisIntervals: 5,
    data,
  },
};

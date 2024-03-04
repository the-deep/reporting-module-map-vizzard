import { type Meta, type StoryObj } from '@storybook/react';
import { TemporalBarChart, type TemporalBarChartProps } from '@the-deep/reporting-module-components';

interface Datum {
    id: number;
    x: string;
    y: number;
    z: number;
}

const chartData: Datum[] = [
  {
    id: 1, x: '2024-02-12', y: 10, z: 5,
  },
  {
    id: 2, x: '2024-03-11', y: 5, z: 6,
  },
  {
    id: 3, x: '2024-08-10', y: 12, z: 2,
  },
  {
    id: 4, x: '2024-09-03', y: 7, z: 11,
  },
];

type ValueKey = 'y1' | 'y2' | 'y3';
type BarChartPropsForStory = TemporalBarChartProps<Datum, ValueKey>;
const colorMap: Record<ValueKey, string> = {
  y1: '#f06690',
  y2: '#ffe082',
  y3: '#a6f0c6',
};

const meta = {
  title: 'BarChart/Temporal',
  component: TemporalBarChart,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<BarChartPropsForStory>;

export default meta;

type Story = StoryObj<BarChartPropsForStory>;

export const Simple: Story = {
  args: {
    data: chartData,
    chartOptions: {
      keySelector: ({ id }) => id,
      xValueSelector: ({ x }) => x,
      yValueSelector: ({ y, z }) => [
        { key: 'y1', value: y },
        { key: 'y2', value: z },
        { key: 'y3', value: y + z },
      ],
      yValueStartsFromZero: true,
    },
    yValueKeys: ['y1', 'y2', 'y3'],
    colorSelector: (key) => colorMap[key],
  },
};

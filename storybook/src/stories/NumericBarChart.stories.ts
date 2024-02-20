import { type Meta, type StoryObj } from '@storybook/react';
import { NumericBarChart, type NumericBarChartProps } from '@the-deep/reporting-module-components';

interface Datum {
    id: number;
    x: number;
    y: number;
    z: number;
}

const chartData: Datum[] = [
  {
    id: 1, x: 4, y: 10, z: 5,
  },
  {
    id: 2, x: 5, y: 5, z: 6,
  },
  {
    id: 3, x: 7, y: 12, z: 2,
  },
  {
    id: 4, x: 9, y: 7, z: 11,
  },
];

type ValueKey = 'y1' | 'y2' | 'y3';
type BarChartPropsForStory = NumericBarChartProps<Datum, ValueKey>;
const colorMap: Record<ValueKey, string> = {
  y1: '#f06690',
  y2: '#ffe082',
  y3: '#a6f0c6',
};

const meta = {
  title: 'BarChart/Numeric',
  component: NumericBarChart,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<BarChartPropsForStory>;

export default meta;

type Story = StoryObj<BarChartPropsForStory>;

export const Simple: Story = {
  args: {
    data: chartData,
    keySelector: ({ id }) => id,
    xValueSelector: ({ x }) => x,
    yValueSelector: ({ y, z }) => [
      { key: 'y1', value: y },
      { key: 'y2', value: z },
      { key: 'y3', value: y + z },
    ],
    yValueKeys: ['y1', 'y2', 'y3'],
    colorSelector: (key) => colorMap[key],
    yValueStartsFromZero: true,
  },
};

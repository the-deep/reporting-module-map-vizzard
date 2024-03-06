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
    title: {
      children: 'Numeric Bar Chart',
      style: { textAlign: 'right' },
    },
    subTitle: {
      children: 'A numeric bar chart or bar graph is a chart or graph that presents numeric data with rectangular bars with heights or lengths proportional to the values that they represent. The bars can be plotted vertically or horizontally. A vertical bar chart is sometimes called a column chart.',
      style: {
        textAlign: 'right',
        color: 'tomato',
      },
    },
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
      xAxisHeight: 56,
    },
    yValueKeys: ['y1', 'y2', 'y3'],
    colorSelector: (key) => colorMap[key],
    chartAxesOptions: {
      yAxisLabel: {
        children: 'Hello this is y-axis label',
        style: {
          fontFamily: 'sans-serif',
          fontSize: 18,
        },
      },
      xAxisLabel: {
        children: 'And this is x-axis label',
      },
      xAxisLineStyle: {
        stroke: 'teal',
        strokeWidth: '2pt',
      },
      xAxisGridLineStyle: {
        stroke: 'lightgray',
      },
    },
  },
};

import { type Meta, type StoryObj } from '@storybook/react';
import { NumericLineChart, type NumericLineChartProps } from '@the-deep/reporting-module-components';

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
type BarChartPropsForStory = NumericLineChartProps<Datum, ValueKey>;
const colorMap: Record<ValueKey, string> = {
  y1: '#f06690',
  y2: '#ffe082',
  y3: '#a6f0c6',
};

const meta = {
  title: 'LineChart/Numeric',
  component: NumericLineChart,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<BarChartPropsForStory>;

export default meta;

type Story = StoryObj<BarChartPropsForStory>;

export const Simple: Story = {
  args: {
    title: {
      children: 'Numeric Line Chart',
    },
    subTitle: {
      children: 'A line chart, also known as a line graph, line plot, or curve chart, is a graphical representation used to display data points connected by straight lines.',
      style: {
        color: 'gray',
        marginBottom: '1rem',
      },
    },
    data: chartData,
    chartOptions: {
      keySelector: ({ id }) => id,
      xValueSelector: ({ x }) => x,
      yValueSelector: ({ y, z }) => [
        { key: 'y1', value: y },
        { key: 'y2', value: z },
      ],
      yValueStartsFromZero: true,
      xAxisHeight: 56,
    },
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
    yValueKeys: ['y1', 'y2'],
    colorSelector: (key) => colorMap[key],
    chartAxesOptions: {
      xAxisLineStyle: {
        stroke: 'teal',
        strokeWidth: '2pt',
      },
      xAxisGridLineStyle: {
        stroke: 'lightgray',
      },
      yAxisLineStyle: {
        stroke: 'teal',
        strokeWidth: '2pt',
      },
      yAxisGridLineStyle: {
        stroke: 'lightgray',
      },
    },
  },
};

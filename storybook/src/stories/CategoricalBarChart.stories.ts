import { type Meta, type StoryObj } from '@storybook/react';
import { CategoricalBarChart, type CategoricalBarChartProps } from '@the-deep/reporting-module-components';

interface Datum {
    id: number;
    x: number;
    y: number;
    z: number;
}

const chartData: Datum[] = [
  {
    id: 1, x: 2, y: 10, z: 5,
  },
  {
    id: 2, x: 5, y: 5, z: 6,
  },
  {
    id: 3, x: 7, y: 12, z: 21,
  },
  {
    id: 4, x: 9, y: 7, z: 11,
  },
];

type ValueKey = 'y1' | 'y2' | 'y3';
type BarChartPropsForStory = CategoricalBarChartProps<Datum, ValueKey>;
const colorMap: Record<ValueKey, string> = {
  y1: '#f06690',
  y2: '#ffe082',
  y3: '#a6f0c6',
};

const meta = {
  title: 'BarChart/Categorical',
  component: CategoricalBarChart,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<BarChartPropsForStory>;

export default meta;

type Story = StoryObj<BarChartPropsForStory>;

export const Simple: Story = {
  args: {
    data: chartData,
    title: {
      children: 'Categorical Bar Chart',
      style: {
        fontFamily: 'Source Sans Pro, sans-serif',
        margin: '0 0 0.5rem 0',
      },
    },
    subTitle: {
      children: 'Bar graphs/charts provide a visual presentation of categorical data. Categorical data is a grouping of data into discrete groups, such as months of the year, age group, shoe sizes, and animals. These categories are usually qualitative. In a column (vertical) bar chart, categories appear along the horizontal axis and the height of the bar corresponds to the value of each category.',
      style: {
        color: 'gray',
        fontFamily: 'Source Sans Pro, sans-serif',
        marginBottom: '2rem',
      },
    },
    xAxisLabel: {
      children: 'Hello this is X-Axis label',
    },
    yAxisLabel: {
      children: 'Hello this is Y-Axis label',
    },
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

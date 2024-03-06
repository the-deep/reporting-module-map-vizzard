import React, { useMemo, useRef } from 'react';
import { listToMap } from '@togglecorp/fujs';

import useCategoricalChartData, { type Options } from '../../hooks/useCategoricalChartData';
import { extractProps, type CombinedProps } from '../../utils/chart';
import BarList from '../BarList';
import ChartAxes from '../ChartAxes';

import BarChartContainer from '../BarChartContainer';

export type Props<DATUM, KEY extends string | number> = CombinedProps<DATUM, KEY, Omit<Options<DATUM, KEY>, 'containerRef'>>

function CategoricalBarChart<DATUM, KEY extends string | number>(props: Props<DATUM, KEY>) {
    const {
        containerProps,
        commonProps: {
            data,
            yValueKeys,
            colorSelector,
        },
        chartDataProps,
        chartAxesProps,
        barListProps: barGroupProps,
    } = extractProps(props);

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const chartData = useCategoricalChartData(
        data,
        {
            containerRef: chartContainerRef,
            ...chartDataProps,
        },
    );

    const colorMap = useMemo(
        () => (
            listToMap(
                yValueKeys,
                (key) => key,
                colorSelector,
            )
        ),
        [colorSelector, yValueKeys],
    );

    const xTickWidth = chartData.dataAreaSize.width / chartData.numXAxisTicks;

    return (
        <BarChartContainer
            containerRef={chartContainerRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...containerProps}
        >
            <ChartAxes
                chartData={chartData}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...chartAxesProps}
            />
            <BarList
                chartData={chartData}
                xTickWidth={xTickWidth}
                colorMap={colorMap}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...barGroupProps}
            />
        </BarChartContainer>
    );
}

export default CategoricalBarChart;

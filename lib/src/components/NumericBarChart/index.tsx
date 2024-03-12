import React, { useMemo, useRef } from 'react';
import { listToMap } from '@togglecorp/fujs';

import useNumericChartData, { type Options } from '../../hooks/useNumericChartData';
import { extractBarChartProps, type CombinedBarChartProps } from '../../utils/chart';
import BarChartContainer from '../BarChartContainer';
import BarList from '../BarList';
import ChartAxes from '../ChartAxes';

export type Props<DATUM, KEY extends string | number> = CombinedBarChartProps<DATUM, KEY, Omit<Options<DATUM, KEY>, 'containerRef'>>

function NumericBarChart<DATUM, KEY extends string | number>(props: Props<DATUM, KEY>) {
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
    } = extractBarChartProps(props);

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const chartData = useNumericChartData(
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

export default NumericBarChart;

import React, { useMemo, useRef } from 'react';
import { listToMap } from '@togglecorp/fujs';

import useNumericChartData, { type Options } from '../../hooks/useNumericChartData';
import { extractLineChartProps, type CombinedLineChartProps } from '../../utils/chart';
import LineChartContainer from '../LineChartContainer';
import ChartAxes from '../ChartAxes';
import PointList from '../LineList';

export type Props<DATUM, KEY extends string | number> = CombinedLineChartProps<DATUM, KEY, Omit<Options<DATUM, KEY>, 'containerRef'>>

function NumericLineChart<DATUM, KEY extends string | number>(props: Props<DATUM, KEY>) {
    const {
        containerProps,
        commonProps: {
            data,
            yValueKeys,
            colorSelector,
        },
        chartDataProps,
        chartAxesProps,
    } = extractLineChartProps(props);

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

    return (
        <LineChartContainer
            containerRef={chartContainerRef}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...containerProps}
        >
            <ChartAxes
                chartData={chartData}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...chartAxesProps}
            />
            <PointList
                chartData={chartData}
                yValueKeys={yValueKeys}
                colorMap={colorMap}
            />
        </LineChartContainer>
    );
}

export default NumericLineChart;

import React, { useMemo, useRef } from 'react';
import { listToMap } from '@togglecorp/fujs';

import useTemporalChartData, { type Options } from '../../hooks/useTemporalChartData';
import { extractProps, type CombinedProps } from '../../utils/chart';

import BarList from '../BarList';
import ChartAxes from '../ChartAxes';

import BarChartContainer from '../BarChartContainer';

export type Props<DATUM, KEY extends string | number> = CombinedProps<DATUM, KEY, Omit<Options<DATUM, KEY>, 'containerRef'>>

function TemporalBarChart<DATUM, KEY extends string | number>(
    props: Props<DATUM, KEY>,
) {
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

    const chartData = useTemporalChartData(
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

    const xTickWidth = chartData.dataAreaSize.width
        / chartData.chartTemporalDiff[chartData.temporalResolution];

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

export default TemporalBarChart;

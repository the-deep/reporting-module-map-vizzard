import React, { useMemo, useRef } from 'react';
import { _cs, listToMap } from '@togglecorp/fujs';

import useNumericChartData, { type Options } from '../../hooks/useNumericChartData';
import { extractProps, type CombinedProps } from '../../utils/chart';
import BarList from '../BarList';
import ChartAxes from '../ChartAxes';

import styles from './styles.module.css';

export type Props<DATUM, KEY extends string | number> = CombinedProps<DATUM, KEY, Omit<Options<DATUM, KEY>, 'containerRef'>>

function NumericBarChart<DATUM, KEY extends string | number>(props: Props<DATUM, KEY>) {
    const {
        commonProps: {
            className,
            data,
            yValueKeys,
            colorSelector,
        },
        chartDataProps,
        chartAxesProps,
        barListProps: barGroupProps,
    } = extractProps(props);

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
        <div
            className={_cs(styles.barChart, className)}
            ref={chartContainerRef}
        >
            <svg className={styles.svg}>
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
            </svg>
        </div>
    );
}

export default NumericBarChart;

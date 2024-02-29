import { useMemo } from 'react';
import {
    isDefined,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import {
    ChartGroupingMode,
    Bounds,
    ChartScale,
    getChartDimensions,
    getIntervals,
    getScaleFunction,
    getYDomain,
    Rect,
} from '../utils/chart';
import { formatNumber } from '../utils/common';
import {
    DEFAULT_X_AXIS_HEIGHT,
    DEFAULT_Y_AXIS_WIDTH,
    defaultChartMargin,
    defaultChartPadding,
    NUM_X_AXIS_TICKS_MIN,
} from '../utils/constants';
import useSizeTracking from './useSizeTracking';

export interface Options<DATUM, KEY> {
    containerRef: React.RefObject<HTMLElement>;
    keySelector: (d: DATUM, index: number) => number | string;
    xValueSelector: (d: DATUM, index: number) => React.ReactNode;
    yValueSelector: (d: DATUM, index: number)
        => Array<{ key: KEY, value: number | undefined | null }>;
    xAxisHeight?: number;
    yAxisWidth?: number;
    chartMargin?: Rect;
    chartPadding?: Rect;
    numYAxisTicks?: number;
    yAxisTickLabelSelector?: (value: number, index: number) => React.ReactNode;
    xAxisTickLabelSelector?: (value: DATUM, index: number) => React.ReactNode;
    yDomain?: Bounds;
    yValueStartsFromZero?: boolean;
    yScale?: ChartScale;
    groupingMode?: ChartGroupingMode;
}

function useNumericChartData<DATUM, KEY extends string | number>(
    data: DATUM[] | null | undefined,
    options: Options<DATUM, KEY>,
) {
    const {
        keySelector,
        xValueSelector,
        yValueSelector,
        chartMargin = defaultChartMargin,
        chartPadding = defaultChartPadding,
        containerRef,
        numYAxisTicks = 6,
        xAxisTickLabelSelector,
        yAxisTickLabelSelector,
        yAxisWidth = DEFAULT_Y_AXIS_WIDTH,
        xAxisHeight = DEFAULT_X_AXIS_HEIGHT,
        yDomain,
        yValueStartsFromZero,
        yScale = 'linear',
        groupingMode = 'none',
    } = options;

    const chartSize = useSizeTracking(containerRef);

    const chartData = useMemo(
        () => data?.map(
            (datum, i) => {
                const key = keySelector(datum, i);
                const xValue = xValueSelector(datum, i);
                const yValue = yValueSelector(datum, i);

                if (isNotDefined(xValue) || isNotDefined(yValue)) {
                    return undefined;
                }

                return {
                    key,
                    originalData: datum,
                    xValue,
                    yValue,
                };
            },
        ).filter(isDefined) ?? [],
        [data, keySelector, xValueSelector, yValueSelector],
    );

    const dataDomain = useMemo(
        () => {
            const min = 0;
            const max = chartData.length;

            return {
                min,
                max,
            };
        },
        [chartData],
    );

    const chartDomain = useMemo(
        () => {
            const diff = dataDomain.max - dataDomain.min;

            if (diff >= NUM_X_AXIS_TICKS_MIN) {
                return dataDomain;
            }

            return {
                min: 0,
                max: NUM_X_AXIS_TICKS_MIN,
            };
        },
        [dataDomain],
    );

    const numXAxisTicks = useMemo(
        () => {
            const diff = chartDomain.max - chartDomain.min;

            return diff;
        },
        [chartDomain],
    );

    const {
        dataAreaSize,
        dataAreaOffset,
    } = useMemo(
        () => getChartDimensions({
            chartSize,
            chartMargin,
            chartPadding,
            xAxisHeight,
            yAxisWidth,
            numXAxisTicks,
        }),
        [chartSize, chartMargin, chartPadding, xAxisHeight, yAxisWidth, numXAxisTicks],
    );

    const xAxisDomain = useMemo(
        () => ({ min: chartDomain.min, max: chartDomain.max - 1 }),
        [chartDomain],
    );
    const xScaleFn = useMemo(
        () => getScaleFunction(
            xAxisDomain,
            { min: 0, max: chartSize.width },
            { start: dataAreaOffset.left, end: dataAreaOffset.right },
        ),
        [dataAreaOffset, xAxisDomain, chartSize.width],
    );

    const yAxisDomain = useMemo(
        () => {
            if (isDefined(yDomain)) {
                return yDomain;
            }

            return getYDomain(
                chartData,
                numYAxisTicks,
                yValueStartsFromZero,
                groupingMode,
            );
        },
        [chartData, yDomain, yValueStartsFromZero, numYAxisTicks, groupingMode],
    );

    const yScaleFn = useMemo(
        () => getScaleFunction(
            yAxisDomain,
            { min: 0, max: chartSize.height },
            { start: dataAreaOffset.top, end: dataAreaOffset.bottom },
            true,
            yScale,
        ),
        [yAxisDomain, dataAreaOffset, chartSize.height, yScale],
    );

    const chartPoints = useMemo(
        () => chartData.map(
            (datum, i) => ({
                ...datum,
                x: xScaleFn(i),
                y: listToMap(
                    datum.yValue.map(
                        ({ key, value }) => (
                            isNotDefined(value)
                                ? undefined
                                : {
                                    key,
                                    value: yScaleFn(value),
                                }
                        ),
                    ).filter(isDefined),
                    ({ key }) => key,
                    ({ value }) => value,
                ),
            }),
        ),
        [chartData, xScaleFn, yScaleFn],
    );

    const xAxisTicks = useMemo(
        () => {
            const ticks = chartData.map((datum, i) => ({
                key: datum.key,
                x: xScaleFn(i),
                label: xAxisTickLabelSelector
                    ? xAxisTickLabelSelector(datum.originalData, i)
                    : datum.xValue,
            }));

            if (ticks.length >= NUM_X_AXIS_TICKS_MIN) {
                return ticks;
            }

            const diff = NUM_X_AXIS_TICKS_MIN - ticks.length;
            const additionalTicks = Array.from(Array(diff).keys()).map(
                (_, i) => ({
                    key: `additional-tick-${i}`,
                    x: xScaleFn(ticks.length + i),
                    label: '',
                }),
            );

            return [
                ...ticks,
                ...additionalTicks,
            ];
        },
        [
            chartData,
            xScaleFn,
            xAxisTickLabelSelector,
        ],
    );

    const yAxisTicks = useMemo(
        () => getIntervals(
            yAxisDomain,
            numYAxisTicks,
        ).map((tick, i) => ({
            y: yScaleFn(tick),
            label: yAxisTickLabelSelector
                ? yAxisTickLabelSelector(tick, i)
                : formatNumber(tick, { compact: true }) ?? '',
        })),
        [yAxisDomain, yScaleFn, numYAxisTicks, yAxisTickLabelSelector],
    );

    return useMemo(
        () => ({
            chartPoints,
            xAxisTicks,
            yAxisTicks,
            chartSize,
            xScaleFn,
            yScaleFn,
            dataAreaSize,
            dataAreaOffset,
            xAxisHeight,
            yAxisWidth,
            chartMargin,
            numXAxisTicks,
        }),
        [
            chartPoints,
            xAxisTicks,
            yAxisTicks,
            chartSize,
            xScaleFn,
            yScaleFn,
            dataAreaSize,
            dataAreaOffset,
            chartMargin,
            numXAxisTicks,
            xAxisHeight,
            yAxisWidth,
        ],
    );
}

export default useNumericChartData;

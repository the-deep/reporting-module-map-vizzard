import { isNotDefined } from '@togglecorp/fujs';
import React from 'react';

import { sumSafe } from '../../utils/common';
import {
    BarGroupingMode,
    type Rect,
    type Size,
} from '../../utils/chart';

export interface Props<KEY extends string | number> {
    chartData: {
        chartPoints: {
            key: string | number;
            x: number;
            y: Record<KEY, number>;
        }[];
        dataAreaSize: Size;
        dataAreaOffset: Rect;
    };
    xTickWidth: number;
    barGroupMargin?: number;
    barGroupGap?: number;
    yValueKeys: KEY[];
    colorMap: Record<KEY, string>;
    groupingMode?: BarGroupingMode;
}

function BarList<KEY extends string | number>(props: Props<KEY>) {
    const {
        chartData: {
            chartPoints,
            dataAreaSize,
            dataAreaOffset,
        },
        xTickWidth,
        barGroupGap = 1,
        barGroupMargin = 1,
        yValueKeys,
        colorMap,
        groupingMode = 'side-by-side',
    } = props;

    const maxBarWidth = groupingMode === 'side-by-side'
        ? Math.max((xTickWidth - barGroupMargin * 2), 0) / yValueKeys.length
        : xTickWidth;

    const barWidth = Math.max(
        maxBarWidth - barGroupGap * (yValueKeys.length - 1),
        1,
    );

    return chartPoints.map((chartPoint) => (
        <g key={chartPoint.key}>
            {groupingMode === 'side-by-side' && yValueKeys.map((yValueKey, i) => {
                const currentY = chartPoint.y[yValueKey];

                if (isNotDefined(currentY)) {
                    return null;
                }

                const xOffset = (-xTickWidth / 2)
                    + barGroupMargin
                    + barGroupGap * 2
                    + i * barWidth
                    + i * barGroupGap;

                const barHeight = Math.max(
                    dataAreaSize.height
                        - currentY
                        + dataAreaOffset.top,
                    1,
                );

                return (
                    <rect
                        key={yValueKey}
                        x={chartPoint.x + xOffset}
                        y={currentY}
                        height={barHeight}
                        width={barWidth}
                        fill={colorMap[yValueKey]}
                    />
                );
            })}
            {groupingMode === 'stacked' && yValueKeys.map((yValueKey, i) => {
                const currentY = chartPoint.y[yValueKey];

                if (isNotDefined(currentY)) {
                    return null;
                }

                function getHeight(y: number) {
                    return Math.max(
                        dataAreaSize.height - y + dataAreaOffset.top,
                        1,
                    );
                }

                const previousKeys = yValueKeys.slice(0, i);
                const previousHeights = previousKeys.map(
                    (key) => getHeight(chartPoint.y[key]),
                );

                const yOffset = sumSafe(previousHeights) ?? 0;
                const xOffset = -barWidth / 2;

                const barHeight = getHeight(currentY);
                const y = currentY - yOffset;

                return (
                    <rect
                        key={yValueKey}
                        x={chartPoint.x + xOffset}
                        y={y}
                        height={barHeight}
                        width={barWidth}
                        fill={colorMap[yValueKey]}
                    />
                );
            })}
        </g>
    ));
}

export default BarList;

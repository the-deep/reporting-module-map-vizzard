import React from 'react';

import { getPathData } from '../../utils/chart';

export interface Props<KEY extends string | number> {
    chartData: {
        chartPoints: {
            key: string | number;
            x: number;
            y: Record<KEY, number>;
        }[];
    };
    yValueKeys: KEY[];
    colorMap: Record<KEY, string>;
}

function PointList<KEY extends string | number>(props: Props<KEY>) {
    const {
        chartData: {
            chartPoints,
        },
        yValueKeys,
        colorMap,
    } = props;

    const pointListList = yValueKeys.map(
        (yValueKey) => {
            const pointList = chartPoints.map(
                (point) => ({
                    key: point.key,
                    x: point.x,
                    y: point.y[yValueKey],
                }),
            );

            return {
                key: yValueKey,
                pointList,
            };
        },
    );

    return pointListList.map(
        ({ key, pointList }) => (
            <path
                d={getPathData(pointList)}
                stroke={colorMap[key]}
                fill="none"
                strokeWidth="2pt"
            />
        ),
    );
}

export default PointList;

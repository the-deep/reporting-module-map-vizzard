/* eslint-disable react/require-default-props */
import React, {
    Fragment,
    useCallback,
    useRef,
} from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';

import TextNode, { Props as DefaultTextNodeProps } from '../TextNode';

import {
    type Rect,
    type Size,
} from '../../utils/chart';

import styles from './styles.module.css';

type AxisLabelProps = Omit<DefaultTextNodeProps, 'as'>;

type Key = string | number;

interface TickX {
    key: Key;
    x: number;
    label: React.ReactNode;
}

interface TickY {
    y: number;
    label: React.ReactNode;
}

export interface Props {
    chartData: {
        xAxisTicks: TickX[];
        yAxisTicks: TickY[];
        dataAreaSize: Size;
        dataAreaOffset: Rect;
        chartMargin: Rect;
        chartSize: Size;
        xAxisHeight: number;
        yAxisWidth: number;
    }
    tooltipSelector?: (key: Key, i: number) => React.ReactNode;
    onHover?: (key: Key | undefined, i: number | undefined) => void;
    onClick?: (key: Key, i: number) => void;
    yAxisLabel?: AxisLabelProps & { width?: number };
    xAxisLabel?: AxisLabelProps & { height?: number };

    xAxisGridLineStyle?: React.CSSProperties;
    yAxisGridLineStyle?: React.CSSProperties;

    xAxisLineStyle?: React.CSSProperties;
    yAxisLineStyle?: React.CSSProperties;
}

function ChartAxes(props: Props) {
    const {
        chartData: {
            xAxisTicks,
            yAxisTicks,
            dataAreaSize,
            chartMargin,
            chartSize,
            xAxisHeight,
            yAxisWidth,
            dataAreaOffset,
        },
        tooltipSelector,
        onHover,
        onClick,
        yAxisLabel,
        xAxisLabel,
        xAxisGridLineStyle,
        yAxisGridLineStyle,
        xAxisLineStyle,
        yAxisLineStyle,
    } = props;

    const hoverOutTimeoutRef = useRef<number | undefined>();

    const yAxisTickHeight = dataAreaSize.height / yAxisTicks.length;

    const getMouseOverHandler = useCallback(
        (key: Key, i: number) => {
            if (!onHover) {
                return undefined;
            }

            return () => {
                window.clearTimeout(hoverOutTimeoutRef.current);
                onHover(key, i);
            };
        },
        [onHover],
    );

    const getClickHandler = useCallback(
        (key: Key, i: number) => {
            if (!onClick) {
                return undefined;
            }

            return () => {
                onClick(key, i);
            };
        },
        [onClick],
    );

    const handleMouseOut = useCallback(
        () => {
            if (onHover) {
                window.clearTimeout(hoverOutTimeoutRef.current);
                hoverOutTimeoutRef.current = window.setTimeout(
                    () => {
                        // FIXME: check if component still mounted
                        onHover(undefined, undefined);
                    },
                    200,
                );
            }
        },
        [onHover],
    );

    if (xAxisTicks.length === 0) {
        return null;
    }

    const xAxisDiff = dataAreaSize.width / xAxisTicks.length;

    const yAxisLabelWidth = yAxisLabel?.width ?? 20;
    const xAxisLabelHeight = xAxisLabel?.height ?? 20;

    const yAxisAreaX1 = chartMargin.left;
    const yAxisAreaX2 = chartMargin.left + yAxisWidth;

    const xAxisAreaY1 = Math.max(
        chartSize.height - chartMargin.bottom - xAxisHeight,
        0,
    );

    const chartAreaX2 = chartSize.width - chartMargin.right;
    const chartAreaY1 = chartMargin.top;

    return (
        <g className={styles.chartAxes}>
            {isDefined(yAxisLabel) && (
                <foreignObject
                    x={0}
                    y={chartSize.height - yAxisLabelWidth}
                    width={chartSize.height}
                    height={yAxisLabelWidth}
                    className={styles.yAxisLabelContainer}
                    style={{ transformOrigin: `0 ${chartSize.height - yAxisLabelWidth}px` }}
                >
                    <TextNode
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...yAxisLabel}
                        className={_cs(styles.yAxisLabel, yAxisLabel.className)}
                    />
                </foreignObject>
            )}
            <g>
                {yAxisTicks.map((pointData, i) => (
                    <Fragment key={pointData.y}>
                        {i === 0 && xAxisLineStyle && (
                            <line
                                className={styles.xAxisGridLine}
                                style={xAxisLineStyle}
                                x1={yAxisAreaX2}
                                y1={pointData.y}
                                x2={chartAreaX2}
                                y2={pointData.y}
                            />
                        )}
                        {i !== 0 && xAxisGridLineStyle && (
                            <line
                                className={styles.xAxisGridLine}
                                style={xAxisGridLineStyle}
                                x1={yAxisAreaX2}
                                y1={pointData.y}
                                x2={chartAreaX2}
                                y2={pointData.y}
                            />
                        )}
                        <foreignObject
                            x={yAxisAreaX1}
                            y={pointData.y - yAxisTickHeight / 2}
                            width={yAxisWidth}
                            height={yAxisTickHeight}
                        >
                            <div
                                className={styles.yAxisTickText}
                                style={{
                                    width: yAxisWidth,
                                    height: yAxisTickHeight,
                                }}
                                title={typeof pointData.label === 'string' ? String(pointData.label) : undefined}
                            >
                                {pointData.label}
                            </div>
                        </foreignObject>
                    </Fragment>
                ))}
            </g>
            <g>
                {xAxisTicks.map((pointData, i) => {
                    const tick = pointData;

                    const startX = tick.x;

                    const x = startX;
                    const y = xAxisAreaY1;

                    const xTickLabelX1 = x - xAxisDiff / 2;
                    const xTickWidth = xAxisDiff;

                    return (
                        <Fragment key={tick.x}>
                            {i === 0 && yAxisLineStyle && (
                                <line
                                    className={styles.yAxisGridLine}
                                    style={yAxisLineStyle}
                                    x1={x}
                                    y1={chartAreaY1}
                                    x2={x}
                                    y2={xAxisAreaY1}
                                />
                            )}
                            {i !== 0 && yAxisGridLineStyle && (
                                <line
                                    className={styles.yAxisGridLine}
                                    style={yAxisGridLineStyle}
                                    x1={x}
                                    y1={chartAreaY1}
                                    x2={x}
                                    y2={xAxisAreaY1}
                                />
                            )}
                            <foreignObject
                                className={styles.xAxisTick}
                                x={xTickLabelX1}
                                y={y}
                                width={xTickWidth}
                                height={xAxisHeight}
                                style={{
                                    transformOrigin: `${xTickLabelX1}px ${y}px`,
                                }}
                            >
                                <div
                                    className={styles.xAxisTickText}
                                    style={{
                                        width: xTickWidth,
                                        height: xAxisHeight,
                                    }}
                                    title={typeof tick.label === 'string' ? String(tick.label) : undefined}
                                >
                                    {tick.label}
                                </div>
                            </foreignObject>
                            {(isDefined(tooltipSelector) || isDefined(onHover)) && (
                                <rect
                                    x={startX - xTickWidth / 2}
                                    width={xTickWidth}
                                    y={chartAreaY1}
                                    height={xAxisAreaY1}
                                    className={styles.boundRect}
                                    onClick={getClickHandler(tick.key, i)}
                                    onMouseOver={getMouseOverHandler(tick.key, i)}
                                    onMouseOut={handleMouseOut}
                                >
                                    {tooltipSelector?.(tick.key, i)}
                                </rect>
                            )}
                        </Fragment>
                    );
                })}
            </g>
            {isDefined(xAxisLabel) && (
                <foreignObject
                    x={dataAreaOffset.left}
                    y={chartSize.height - xAxisLabelHeight - dataAreaOffset.top}
                    width={dataAreaSize.width}
                    height={xAxisLabelHeight}
                    className={styles.xAxisLabelContainer}
                >
                    <TextNode
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...xAxisLabel}
                        className={_cs(styles.xAxisLabel, xAxisLabel.className)}
                    />
                </foreignObject>
            )}
        </g>
    );
}

export default ChartAxes;
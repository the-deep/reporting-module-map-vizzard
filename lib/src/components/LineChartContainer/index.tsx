import React from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';

import TextNode, { type Props as DefaultTextNodeProps } from '../TextNode';

import styles from './styles.module.css';

type TextNodeProps = Omit<DefaultTextNodeProps, 'as'>;

const DEFAULT_CHART_HEIGHT = 320;

export interface Props {
    className?: string;
    title?: TextNodeProps;
    subTitle?: TextNodeProps;
    children: React.ReactNode;
    chartHeight?: number;
    svgClassName?: string;
    containerRef?: React.RefObject<HTMLDivElement>;
    xAxisLabel?: TextNodeProps;
    yAxisLabel?: TextNodeProps;
}

function LineChartContainer(props: Props) {
    const {
        className,
        title,
        subTitle,
        children,
        chartHeight = DEFAULT_CHART_HEIGHT,
        xAxisLabel,
        yAxisLabel,
        svgClassName,
        containerRef,
    } = props;

    return (
        <div className={_cs(styles.lineChartContainer, className)}>
            {isDefined(title) && (
                <TextNode
                    as="h2"
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...title}
                />
            )}
            {isDefined(subTitle) && (
                <TextNode
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...subTitle}
                />
            )}
            <div className={styles.chartLayoutContainer}>
                {isDefined(xAxisLabel) && (
                    <TextNode
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...xAxisLabel}
                        style={{
                            height: `${chartHeight}px`,
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            textAlign: 'center',
                            ...xAxisLabel.style,
                        }}
                    />
                )}
                <div
                    className={styles.chartContainer}
                    ref={containerRef}
                    style={{ height: `${chartHeight}px` }}
                >
                    <svg className={_cs(styles.svg, svgClassName)}>
                        {children}
                    </svg>
                </div>
            </div>
            {isDefined(yAxisLabel) && (
                <TextNode
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...yAxisLabel}
                    style={{
                        textAlign: 'center',
                        ...yAxisLabel.style,
                    }}
                />
            )}
        </div>
    );
}

export default LineChartContainer;

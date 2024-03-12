import React from 'react';
import { _cs, isDefined } from '@togglecorp/fujs';

import TextNode, { type Props as DefaultTextNodeProps } from '../TextNode';

import styles from './styles.module.css';

type TextNodeProps = Omit<DefaultTextNodeProps, 'as'>;

export interface Props {
    className?: string;
    title?: TextNodeProps;
    subTitle?: TextNodeProps;
    children: React.ReactNode;
    chartHeight?: number;
    svgClassName?: string;
    containerRef?: React.RefObject<HTMLDivElement>;
}

function BarChartContainer(props: Props) {
    const {
        className,
        title,
        subTitle,
        children,
        chartHeight,
        svgClassName,
        containerRef,
    } = props;

    return (
        <div className={_cs(styles.barChartContainer, className)}>
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
            <div ref={containerRef}>
                <svg
                    className={_cs(styles.svg, svgClassName)}
                    style={isDefined(chartHeight) ? { height: `${chartHeight}px}` } : undefined}
                >
                    {children}
                </svg>
            </div>
        </div>
    );
}

export default BarChartContainer;

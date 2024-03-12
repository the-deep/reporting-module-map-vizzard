import React from 'react';
import { scalePow } from 'd3';
import { _cs } from '@togglecorp/fujs';
import * as d3ColorScale from 'd3-scale-chromatic';

import styles from './styles.module.css';

// FIXME: We have removed the default behavior for colorScale and colorScaleType
export type Props = {
    steps?: number;
    pow?: number;
    containerClass?: string; // FIXME: why are we using this style
    inverted?: boolean;
} & ({
    colorScale: 'BrBG' | 'PRGn' | 'PiYG' | 'PuOr' | 'RdBu' | 'RdGy' | 'RdYlBu' | 'RdYlGn' | 'Spectral' | 'Blues' | 'Greens' | 'Greys' | 'Oranges' | 'Purples' | 'Reds' | 'BuPu' | 'GnBu' | 'OrRd' | 'PuBuGn' | 'PuBu' | 'PuRd' | 'RdPu' | 'YlGnBu' | 'YlGn' | 'YlOrBr' | 'YlOrRd';
    colorScaleType: 'continuous' | 'steps';
} | {
    colorScale: 'Category10' | 'Accent' | 'Dark2' | 'Paired' | 'Pastel1' | 'Pastel2' | 'Set1' | 'Set2' | 'Set3' | 'Tableau10';
    colorScaleType: 'categorised';
})

function ColorScale(props: Props) {
    const {
        steps = 12,
        pow = 1,
        containerClass = 'colorScaleDiv',
        inverted = false,
    } = props;

    let numSteps = steps;
    // eslint-disable-next-line react/destructuring-assignment
    if (props.colorScaleType === 'continuous') {
        numSteps = 50;
    }

    let colorsArray: readonly string[];
    // eslint-disable-next-line react/destructuring-assignment
    if (props.colorScaleType === 'categorised') {
        // eslint-disable-next-line react/destructuring-assignment
        colorsArray = d3ColorScale[`scheme${props.colorScale}`];
    } else {
        // eslint-disable-next-line react/destructuring-assignment
        const interpolator = d3ColorScale[`interpolate${props.colorScale}`];
        colorsArray = Array.from(
            { length: numSteps },
            (_, i) => interpolator(i * (1 / (numSteps))),
        );
    }

    let fillPow = pow;
    // eslint-disable-next-line react/destructuring-assignment
    if (props.colorScaleType === 'steps' || props.colorScaleType === 'categorised') {
        fillPow = 1;
    }

    if (inverted) {
        colorsArray = [...colorsArray].reverse();
    }

    const colorsArrayPow = scalePow()
        .exponent(fillPow)
        .domain([0, numSteps]);

    const colorStrPow = colorsArray.map((_, i) => {
        const colorIndex = Math.ceil(colorsArrayPow(i) * (numSteps));
        return colorsArray[colorIndex];
    });

    const colorsString = colorStrPow.join(', ');
    const cssGradient = {
        background: `linear-gradient(90deg, ${colorsString})`,
    };

    return (
        <div
            // FIXME: use _cs
            className={_cs(styles.colorScaleContainer, styles[containerClass])}
        >
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {(props.colorScaleType === 'steps' || props.colorScaleType === 'categorised') && (
                <div className={styles.colorScale}>
                    {colorStrPow.map((color, index) => (
                        <div
                            key={`${index + color}`}
                            className={styles.steps}
                        >
                            <div style={{ backgroundColor: color }} />
                        </div>
                    ))}
                </div>
            )}
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {props.colorScaleType === 'continuous' && (
                <div
                    className={styles.colorScale}
                    style={cssGradient}
                    role="presentation"
                />
            )}
        </div>
    );
}

export default ColorScale;

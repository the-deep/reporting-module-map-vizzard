/* eslint-disable react/require-default-props */
import React from 'react';

export interface Props {
    className?: string;
    as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
    style?: React.CSSProperties;
    children: React.ReactNode;
}

function TextNode(props: Props) {
    const {
        className,
        as = 'div',
        style,
        children,
    } = props;

    const Element = as as React.ElementType;

    return (
        <Element
            className={className}
            style={style}
        >
            {children}
        </Element>
    );
}

export default TextNode;

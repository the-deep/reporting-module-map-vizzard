import { useEffect, useMemo, useRef } from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { Map as MapFromLib } from 'ol';
import OLVectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import {
    Style,
    Stroke,
} from 'ol/style';

import { LineLayer } from '../index';
import { rgba } from '../helpers';

const DEFAULT_STROKE_COLOR = '#787878';

interface Props extends Pick<LineLayer, 'zIndex' | 'opacity' | 'style'> {
    map: MapFromLib | undefined;
    source: VectorSource;
}

function LineLayer(props: Props) {
    const {
        map,
        source,
        style,
        zIndex = 1,
        opacity = 1,
    } = props;

    const configRef = useRef({
        zIndex,
        opacity,
    });

    // line vectors
    const lineLayer = useMemo(
        () => {
            const styles: Style[] = [];

            const lineDash = style.strokeType === 'dash'
                ? [style.dashSpacing / 3, style.dashSpacing]
                : undefined;

            const stroke = new Stroke({
                width: style.strokeWidth,
                color: rgba(style.stroke) ?? DEFAULT_STROKE_COLOR,
                lineDash,
            });

            if (style) {
                styles.push(
                    new Style({ stroke }),
                );
            }

            return new OLVectorLayer({
                source,
                style: styles,
                zIndex: configRef.current.zIndex,
                opacity: configRef.current.opacity,
            });
        },
        [source, style],
    );

    useEffect(
        () => {
            const currentMap = map;
            const addedLayer = lineLayer;

            if (isNotDefined(currentMap) || isNotDefined(addedLayer)) {
                return undefined;
            }

            currentMap.addLayer(addedLayer);

            return () => {
                currentMap.removeLayer(addedLayer);
            };
        },
        [map, lineLayer],
    );

    useEffect(() => {
        if (isNotDefined(lineLayer)) {
            return;
        }

        lineLayer.setOpacity(opacity);
        lineLayer.setZIndex(zIndex);
    }, [lineLayer, opacity, zIndex]);

    return null;
}

export default LineLayer;

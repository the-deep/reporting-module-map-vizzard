import { useEffect, useState } from 'react';
import { Map as MapFromLib } from 'ol';
import OLVectorLayer from 'ol/layer/Vector';
import { Vector as VectorSource } from 'ol/source';
import {
    Style,
    Stroke,
} from 'ol/style';

import { LineLayer } from '../index';
import { rgba } from '../helpers';

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

    const [lineLayer, setLineLayer] = useState(undefined);

    // line vectors
    useEffect(() => {
        if (!map) return undefined;
        const styles = [];

        const lineDash = style.strokeType === 'dash'
            ? [style.dashSpacing / 3, style.dashSpacing]
            : undefined;

        const stroke = new Stroke({
            width: style.strokeWidth,
            color: rgba(style.stroke),
            lineDash,
        });

        if (style) {
            styles.push(
                new Style({ stroke }),
            );
        }

        const vLayer = new OLVectorLayer({
            source,
            style() {
                return styles;
            },
        });

        map.addLayer(vLayer);
        vLayer.setZIndex(zIndex);
        vLayer.setOpacity(opacity);
        setLineLayer(vLayer);

        return () => {
            if (map) {
                map.removeLayer(vLayer);
            }
        };
    }, [map, JSON.stringify(style)]);

    useEffect(() => {
        if (!lineLayer) return;
        lineLayer.setOpacity(opacity);
    }, [lineLayer, opacity]);

    useEffect(() => {
        if (!lineLayer) return;
        lineLayer.setZIndex(zIndex);
    }, [lineLayer, zIndex]);

    return null;
}

export default LineLayer;

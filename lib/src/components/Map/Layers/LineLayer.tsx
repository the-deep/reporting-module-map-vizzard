import {
    useEffect,
    useRef,
    useMemo,
    useContext,
} from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import OLVectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { get } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { type ColorLike } from 'ol/colorlike';
import {
    Style,
    Stroke,
} from 'ol/style';

import MapContext from '../MapContext';
import { vector } from '../helpers';

const DEFAULT_STROKE_COLOR = '#787878';

export interface Props {
    source: VectorSource;

    opacity: number;
    zIndex: number;
    style: {
        dashSpacing: number;
        stroke: ColorLike;
        strokeType: 'dash' | 'solid'; // FIXME: enum is not complete
        strokeWidth: number;
    };
}

function LineLayer(props: Props) {
    const {
        source,
        style,
        zIndex = 1,
        opacity = 1,
    } = props;

    const { map } = useContext(MapContext);

    const configRef = useRef({
        zIndex,
        opacity,
    });

    // line vectors
    const lineLayer = useMemo(
        () => {
            const lineDash = style.strokeType === 'dash'
                ? [style.dashSpacing / 3, style.dashSpacing]
                : undefined;

            const stroke = new Stroke({
                width: style.strokeWidth,
                color: style.stroke ?? DEFAULT_STROKE_COLOR,
                lineDash,
            });

            return new OLVectorLayer({
                // TODO: simplify this
                source: vector({
                    features: new GeoJSON().readFeatures(source, {
                        featureProjection: get('EPSG:3857') ?? undefined,
                    }),
                }),
                style: new Style({ stroke }),
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

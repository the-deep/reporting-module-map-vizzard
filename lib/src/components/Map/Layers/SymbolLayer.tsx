import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import OLVectorLayer from 'ol/layer/Vector';
import {
    Style,
    Stroke,
    Icon,
    Fill,
    Text,
} from 'ol/style';
import Circle from 'ol/style/Circle';
import Point from 'ol/geom/Point';
import OlFeature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { isDefined, isNotDefined } from '@togglecorp/fujs';
import type { FeatureCollection, Feature } from 'geojson';
import { type ColorLike } from 'ol/colorlike';

import capital from '../assets/map-icons/capital.svg';
import city from '../assets/map-icons/city.svg';
import settlement from '../assets/map-icons/settlement.svg';
import marker from '../assets/map-icons/marker.svg';
import airport from '../assets/map-icons/airport.svg';
import borderCrossing from '../assets/map-icons/borderCrossing.svg';
import borderCrossingActive from '../assets/map-icons/borderCrossingActive.svg';
import borderCrossingPotential from '../assets/map-icons/borderCrossingPotential.svg';
import triangle from '../assets/map-icons/triangle.svg';
import idpRefugeeCamp from '../assets/map-icons/idp-refugee-camp.svg';

import { numberFormatter, vector } from '../helpers';
import MapContext from '../MapContext';

const DEFAULT_STROKE_COLOR = '#717171';
const DEFAULT_FILL_COLOR = '#f0f0f0';

const symbolIcons = {
    airport,
    borderCrossing,
    borderCrossingActive,
    borderCrossingPotential,
    capital,
    circle: 'circle',
    city,
    idpRefugeeCamp,
    marker,
    settlement,
    triangle,
};

export type Symbols = keyof typeof symbolIcons;
export type ScaleTypes = 'fixed' | 'proportional';
export type ScalingTechnique = 'absolute' | 'flannery';

export interface Props {
    // layerId: string;

    labelVariant?: 'population';
    labelPropertyKey?: string;
    scalePropertyKey?: string;

    opacity: number | undefined;
    scaleDataMax: number | undefined;
    // scaleDataMin: number;
    scale: number | undefined;
    scaleType?: ScaleTypes;
    scalingTechnique?: ScalingTechnique;
    showLabels: boolean;
    symbol: Symbols;

    /*
    enableTooltips: boolean;
    tooltipTitlePropertyKey: string;
    tooltipValuePropertyKey: string;
    tooltipValueLabel: string;
    */

    zIndex: number;
    symbolStyle: {
        fill: ColorLike | undefined;
        stroke: ColorLike | undefined;
        strokeWidth: number;
    }
    labelStyle: {
        color: ColorLike | undefined;
        fontFamily: string | undefined;
        fontSize: number;
        fontWeight?: 'bold' | 'normal';
        showHalo: boolean;
        textAlign?: 'left' | 'center' | 'right';
        transform?: 'uppercase';
    };
    // primaryColor: string | null;
    data: FeatureCollection | Feature[];
}

function SymbolLayer(props: Props) {
    const {
        // layerId,
        data,
        symbol,

        zIndex = 1,
        opacity = 1,
        showLabels = false,
        labelVariant,
        labelPropertyKey,
        scale = 1,
        scaleType = 'fixed',
        scalingTechnique = 'flannery',
        scalePropertyKey,
        // scaleDataMin = 0,
        scaleDataMax = 0,
        symbolStyle,
        labelStyle,

        /*
        enableTooltips = false,
        tooltipTitlePropertyKey,
        tooltipValuePropertyKey,
        tooltipValueLabel,
        primaryColor,
        */
    } = props;

    const { map } = useContext(MapContext);

    const styleFunction = useCallback(
        (size: number, selected = false) => {
            const {
                strokeWidth,
                fill,
                stroke,
            } = symbolStyle;

            if (symbol === 'circle') {
                return new Style({
                    image: new Circle({
                        radius: size,
                        fill: new Fill({
                            color: fill ?? DEFAULT_FILL_COLOR,
                        }),
                        stroke: new Stroke({
                            color: stroke ?? DEFAULT_STROKE_COLOR,
                            width: selected ? strokeWidth + 0.5 : strokeWidth,
                        }),
                    }),
                });
            }

            return new Style({
                image: new Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    scale: size,
                    src: symbolIcons[symbol],
                }),
            });
        },
        [symbol, symbolStyle],
    );

    const symbolLayer = useMemo(
        () => {
            const xOffset = symbol === 'capital' ? 1.9 : 1;
            const points = Array.isArray(data) ? data : data.features;

            const features = points.map(
                (point: Feature) => {
                    if (point.geometry.type !== 'Point') {
                        return undefined;
                    }

                    const { coordinates } = point.geometry;
                    const { properties } = point;

                    if (isNotDefined(coordinates) || isNotDefined(properties)) {
                        return undefined;
                    }

                    const exp = scalingTechnique === 'flannery' ? 0.5716 : 0.5;

                    function getSize() {
                        if (
                            isNotDefined(properties)
                            || scaleType !== 'proportional'
                            || isNotDefined(scalePropertyKey)
                        ) {
                            return scale;
                        }

                        const ratio = properties[scalePropertyKey] / scaleDataMax;
                        return scale * ratio;
                    }

                    function getRadius() {
                        if (
                            isNotDefined(properties)
                            || scaleType !== 'proportional'
                            || isNotDefined(scalePropertyKey)
                        ) {
                            return (1 / Math.PI) ** exp * (10 * scale);
                        }

                        return (
                            (properties[scalePropertyKey] / scaleDataMax) / Math.PI
                        ) ** exp * (10 * scale);
                    }

                    function getTextAlign() {
                        if (isDefined(labelStyle.textAlign)) {
                            return labelStyle.textAlign;
                        }

                        if (scaleType === 'proportional') {
                            return 'center';
                        }

                        return 'left';
                    }

                    function getDefaultStyle() {
                        if (isNotDefined(properties) || showLabels !== true) {
                            return undefined;
                        }

                        const initialLabel = (
                            isDefined(properties)
                                && isDefined(labelPropertyKey)
                                && isDefined(properties[labelPropertyKey])
                        )
                            ? String(properties[labelPropertyKey])
                            : '';

                        const label = labelStyle.transform === 'uppercase'
                            ? initialLabel.toUpperCase()
                            : initialLabel;

                        const stroke = labelStyle.showHalo
                            ? new Stroke({
                                color: DEFAULT_STROKE_COLOR,
                                width: 2,
                            }) : undefined;

                        const textAlign = getTextAlign();

                        let yPos = 1;
                        let xPos = 7 + xOffset;

                        if (scale < 0.5) {
                            xPos = 4 + xOffset;
                            yPos = 0;
                        }

                        if (scaleType === 'proportional') {
                            xPos = 0;
                        }

                        if (labelVariant === 'population') yPos = -5;
                        if (
                            labelVariant !== 'population'
                            || (scalePropertyKey && properties[scalePropertyKey] >= 5)
                        ) {
                            return (
                                new Style({
                                    text: new Text({
                                        text: label,
                                        font: `${labelStyle.fontWeight} ${labelStyle.fontSize}px/1.07 ${labelStyle.fontFamily},sans-serif`,
                                        textAlign,
                                        offsetY: yPos,
                                        offsetX: xPos,
                                        fill: new Fill({
                                            color: labelStyle.color,
                                        }),
                                        stroke,
                                    }),
                                })
                            );
                        }

                        if (
                            labelVariant === 'population'
                            && scalePropertyKey
                            && properties[scalePropertyKey] >= 5
                        ) {
                            const labelValue = properties[scalePropertyKey];

                            return (
                                new Style({
                                    text: new Text({
                                        text: numberFormatter(labelValue),
                                        font: `bold ${(labelStyle.fontSize + 2)}px/1.07 ${labelStyle.fontFamily},sans-serif`,
                                        textAlign,
                                        offsetY: yPos + 10,
                                        offsetX: xPos,
                                        fill: new Fill({
                                            color: labelStyle.color,
                                        }),
                                        stroke,
                                    }),
                                })
                            );
                        }

                        return undefined;
                    }

                    const feature = new OlFeature(
                        new Point(fromLonLat(coordinates)),
                    );
                    feature.setProperties({ lon: coordinates[0], lat: coordinates[1] });
                    const additionalStyle = getDefaultStyle();
                    const userDefinedStyle = styleFunction(getSize());

                    const iconStyle = [
                        additionalStyle,
                        userDefinedStyle,
                    ].filter(isDefined);

                    feature.setStyle(iconStyle);

                    if (symbol === 'circle') {
                        const r = getRadius();

                        if (r > 0) {
                            feature.setProperties({ size: r });
                        } else {
                            feature.setProperties({ size: r, opacity: 0 });
                        }
                    } else {
                        const size = getSize();
                        feature.setProperties({ size });
                    }

                    return feature;
                },
            ).filter(isDefined);

            return new OLVectorLayer({
                source: vector({ features }),
            });
        },
        [
            data,
            labelPropertyKey,
            labelStyle,
            labelVariant,
            scale,
            scaleType,
            scalingTechnique,
            scalePropertyKey,
            scaleDataMax,
            styleFunction,
            showLabels,
            symbol,
        ],
    );

    useEffect(() => {
        const currentMap = map;
        const addedLayer = symbolLayer;

        if (isNotDefined(currentMap) || isNotDefined(addedLayer)) {
            return undefined;
        }

        currentMap.addLayer(addedLayer);

        return () => {
            currentMap.removeLayer(addedLayer);
        };
    }, [map, symbolLayer]);

    useEffect(() => {
        if (!symbolLayer) return;
        symbolLayer.setOpacity(opacity);
    }, [symbolLayer, opacity]);

    useEffect(() => {
        if (!symbolLayer) return;
        symbolLayer.setZIndex(zIndex);
    }, [symbolLayer, zIndex]);

    return null;
}

export default SymbolLayer;

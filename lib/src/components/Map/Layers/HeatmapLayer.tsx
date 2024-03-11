import { useEffect, useMemo, useRef } from 'react';
import { Map as MapFromLib } from 'ol';
import { Heatmap } from 'ol/layer';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import * as d3ColorScale from 'd3-scale-chromatic';
import { scaleLog } from 'd3-scale';

import { HeatMapLayer, HeatMapLayerProperty } from '../index';
import { vector } from '../helpers';

interface Props extends Pick<HeatMapLayer, 'data' | 'zIndex' | 'opacity' | 'blur' | 'radius' | 'fillPalette' | 'weighted' | 'scaleDataMax'>
{
    map: MapFromLib | undefined;
    weightProperty?: string;
}

function HeatmapLayer(props: Props) {
    const {
        map,
        data,
        zIndex = 1,
        opacity = 1,
        blur,
        radius,
        fillPalette,
        weighted = false,
        // FIXME: there should not be any default weightProperty
        weightProperty = 'fatalities',
        scaleDataMax = 350,
    } = props;

    const scaleWeight = useMemo(
        () => scaleLog()
            .domain([1, scaleDataMax])
            .range([0.4, 1]),
        [scaleDataMax],
    );

    const configRef = useRef({
        weighted,
        weightProperty,
        blur,
        radius,
        scaleWeight,
        zIndex,
    });

    const layerData = useMemo(
        () => {
            const properties: HeatMapLayerProperty[] = Array.isArray(data)
                ? data
                : data.features.map((datum) => ({
                    ...datum.properties,
                    lon: datum.geometry.coordinates[0],
                    lat: datum.geometry.coordinates[1],
                }));

            const features = properties.map((item) => {
                const feature = new Feature(
                    new Point(fromLonLat([item.lon, item.lat])),
                );
                feature.setProperties(item);
                return feature;
            });

            const colorInterpolationFn = d3ColorScale[`interpolate${fillPalette}`];
            const numSteps = 5;
            const colors = Array.from(
                { length: numSteps },
                (_, i) => colorInterpolationFn(i * (1 / numSteps)),
            );

            return new Heatmap({
                source: vector<Point>({ features }),
                blur: configRef.current.blur,
                radius: configRef.current.radius,
                gradient: colors,
                zIndex: configRef.current.zIndex,
                weight: (feature) => {
                    if (configRef.current.weighted) {
                        const w = scaleWeight(
                            parseFloat(feature.get(configRef.current.weightProperty)),
                        ) || 0;
                        return w;
                    }

                    return 0.7;
                },
            });
        },
        [data, fillPalette, scaleWeight],
    );

    useEffect(
        () => {
            const addedLayer = layerData;
            const targetMap = map;

            if (!targetMap || !addedLayer) {
                return undefined;
            }

            targetMap.addLayer(addedLayer);

            return () => {
                targetMap.removeLayer(addedLayer);
            };
        },
        [map, layerData],
    );

    useEffect(
        () => {
            if (!layerData) {
                return;
            }

            let properties: HeatMapLayerProperty[];
            if (Array.isArray(data)) {
                properties = data;
            } else {
                properties = data.features.map((datum) => ({
                    ...datum.properties,
                    lon: datum.geometry.coordinates[0],
                    lat: datum.geometry.coordinates[1],
                    exclude_from_heatmap: Boolean(datum.properties?.exclude_from_heatmap),
                }));
            }

            const features = properties.filter((item) => !item.exclude_from_heatmap).map((item) => {
                const feature = new Feature(
                    new Point(fromLonLat([item.lon, item.lat])),
                );
                feature.setProperties(item);
                return feature;
            });

            // FIXME: should we return instead
            const source = layerData.getSource();
            source?.clear();
            source?.addFeatures(features);
        },
        [layerData, data],
    );

    useEffect(
        () => {
            if (!layerData) {
                return;
            }

            layerData.setOpacity(opacity);
            layerData.setZIndex(zIndex);
            layerData.setBlur(blur);
            layerData.setRadius(radius);
        },
        [layerData, opacity, zIndex, radius, blur],
    );

    return null;
}

export default HeatmapLayer;

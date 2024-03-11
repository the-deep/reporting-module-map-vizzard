import {
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import { Heatmap } from 'ol/layer';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import * as d3ColorScale from 'd3-scale-chromatic';
import { scaleLog } from 'd3-scale';

import { vector } from '../helpers';
import MapContext from '../MapContext';

export type HeatMapLayerProperty = GeoJSON.GeoJsonProperties & {
    lon: number;
    lat: number;
    // FIXME: This is not used consistently
    exclude_from_heatmap?: boolean;
}

type D3InterpolationSchemes = 'Blues' | 'Greens' | 'Greys' | 'Oranges' | 'Purples' | 'Reds' | 'Turbo' | 'Viridis' | 'Inferno' | 'Magma' | 'Plasma' | 'Cividis' | 'Warm' | 'Cool' | 'CubehelixDefault' | 'BuGn' | 'BuPu' | 'GnBu' | 'OrRd' | 'PuBuGn' | 'PuBu' | 'PuRd' | 'RdPu' | 'YlGnBu' | 'YlGn' | 'YlOrBr' | 'YlOrRd'
| 'Rainbow' | 'Sinebow'
| 'BrBG' | 'PRGn' | 'PiYG' | 'PuOr' | 'RdBu' | 'RdGy' | 'RdYlBu' | 'RdYlGn' | 'Spectral';

export interface Props {
    data: HeatMapLayerProperty[] | GeoJSON.FeatureCollection<GeoJSON.Point>;
    zIndex: number;
    opacity: number;
    blur: number;
    radius: number;
    fillPalette: D3InterpolationSchemes;
    weighted: boolean;
    weightPropertyKey: string; // Only applicable when weighted = true
    scaleDataMax: number;
}

function HeatmapLayer(props: Props) {
    const {
        data,
        zIndex = 1,
        opacity = 1,
        blur,
        radius,
        fillPalette,
        weighted = false,
        weightPropertyKey,
        scaleDataMax = 350,
    } = props;

    const { map } = useContext(MapContext);

    const scaleWeight = useMemo(
        () => scaleLog()
            .domain([1, scaleDataMax])
            .range([0.4, 1]),
        [scaleDataMax],
    );

    const configRef = useRef({
        weighted,
        weightPropertyKey,
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
                            parseFloat(feature.get(configRef.current.weightPropertyKey)),
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

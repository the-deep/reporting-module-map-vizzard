import { useEffect, useState } from 'react';
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
        scaleDataMax = 350,
    } = props;

    const [heatmapLayer, setHeatmapLayer] = useState<Heatmap | undefined>(undefined);

    const scaleWeight = scaleLog()
        .domain([1, scaleDataMax])
        .range([0.4, 1]);

    useEffect(
        () => {
            if (!map) {
                return undefined;
            }

            let properties: HeatMapLayerProperty[];
            if (Array.isArray(data)) {
                properties = data;
            } else {
                properties = data.features.map((datum) => ({
                    ...datum.properties,
                    lon: datum.geometry.coordinates[0],
                    lat: datum.geometry.coordinates[1],
                }));
            }

            const features = properties.map((item) => {
                const feature = new Feature(
                    new Point(fromLonLat([item.lon, item.lat])),
                );
                feature.setProperties(item);
                return feature;
            });

            if (map && heatmapLayer) {
                map.removeLayer(heatmapLayer);
            }

            const interpolator = d3ColorScale[`interpolate${fillPalette}`];
            const numSteps = 5;
            // eslint-disable-next-line
            const colors = Array.from({ length: numSteps }, (_, i) => interpolator(i * (1 / numSteps)));

            const vectorLayer = new Heatmap({
                source: vector<Point>({ features }),
                blur,
                radius,
                gradient: colors,
                weight: (feature) => {
                    if (weighted) {
                        const w = scaleWeight(parseFloat(feature.get('fatalities'))) || 0;
                        return w;
                    }
                    return 0.7;
                },
            });
            map.addLayer(vectorLayer);
            setHeatmapLayer(vectorLayer);

            return () => {
                if (map) {
                    map.removeLayer(vectorLayer);
                }
            };
        },
        // FIXME: for the missing dependencies, we can store them in intial
        // values using useState or useRef
        // For reference, check other libraries like toggle-form or re-map
        [map, fillPalette, weighted],
    );

    useEffect(
        () => {
            if (!heatmapLayer) {
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
            const source = heatmapLayer.getSource();
            source?.clear();
            source?.addFeatures(features);
        },
        // FIXME: We might not need to use JSON.stringify
        [heatmapLayer, JSON.stringify(data)],
    );

    useEffect(
        () => {
            if (!heatmapLayer) {
                return;
            }
            heatmapLayer.setOpacity(opacity);
        },
        [heatmapLayer, opacity],
    );

    useEffect(
        () => {
            if (!heatmapLayer) {
                return;
            }
            heatmapLayer.setZIndex(zIndex);
        },
        [heatmapLayer, zIndex],
    );

    useEffect(() => {
        if (!heatmapLayer) return;
        heatmapLayer.setBlur(blur);
    }, [heatmapLayer, blur]);

    useEffect(
        () => {
            if (!heatmapLayer) {
                return;
            }
            heatmapLayer.setRadius(radius);
        },
        [heatmapLayer, radius],
    );

    return null;
}

export default HeatmapLayer;

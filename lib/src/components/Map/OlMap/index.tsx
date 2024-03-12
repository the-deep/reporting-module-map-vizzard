import React, {
    useRef,
    useEffect,
    useContext,
} from 'react';
import { _cs, isNotDefined } from '@togglecorp/fujs';
import { View, Map } from 'ol';
import { type Coordinate } from 'ol/coordinate';
import { OverviewMap, ScaleLine, Zoom } from 'ol/control';
import { type Units } from 'ol/control/ScaleLine';
import {
    MouseWheelZoom,
    DragPan,
    DoubleClickZoom,
    defaults,
} from 'ol/interaction';

import MapContext from '../MapContext';
import styles from './styles.module.css';

const DEFAULT_ZOOM_LEVEL = 5;
const DEFAULT_ZOOM_DELTA = 0.5;
const DEFAULT_MIN_ZOOM_LEVEL = 2;
const DEFAULT_MAX_ZOOM_LEVEL = 10;
const DEFAULT_MAP_HEIGHT = 240;

export interface Props {
    center: Coordinate;
    children?: React.ReactNode;
    className?: string;
    enableDoubleClickZoom?: boolean,
    enableDragPan?: boolean,
    enableMouseWheelZoom?: boolean,
    enableZoomControls?: boolean,
    maxZoom?: number;
    minZoom?: number;
    scaleBar?: boolean;
    scaleUnits?: Units;
    showScale?: boolean;
    zoom: number;
    zoomDelta?: number;
    mapHeight?: number;
}

function OlMap(props: Props) {
    const {
        center,
        children,
        className,
        enableDoubleClickZoom = false,
        enableDragPan = true,
        enableMouseWheelZoom = false,
        enableZoomControls,
        maxZoom = DEFAULT_MIN_ZOOM_LEVEL,
        minZoom = DEFAULT_MAX_ZOOM_LEVEL,
        scaleBar,
        scaleUnits,
        showScale,
        zoom = DEFAULT_ZOOM_LEVEL,
        zoomDelta = DEFAULT_ZOOM_DELTA,
        mapHeight = DEFAULT_MAP_HEIGHT,
    } = props;

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { map, setMap } = useContext(MapContext);

    const zoomContainerRef = useRef<HTMLDivElement>(null);
    const scaleContainerRef = useRef<HTMLDivElement>(null);

    const optionsRef = useRef({
        zoom,
        center,
        minZoom,
        maxZoom,
        zoomDelta,
        enableMouseWheelZoom,
        enableDoubleClickZoom,
        enableDragPan,
    });

    // on component mount
    useEffect(
        () => {
            if (isNotDefined(mapContainerRef.current)) {
                return undefined;
            }

            const options = {
                view: new View({
                    zoom: optionsRef.current.zoom,
                    center: optionsRef.current.center,
                    minZoom: optionsRef.current.minZoom,
                    maxZoom: optionsRef.current.maxZoom,
                }),
                layers: [],
                overlays: [],
                controls: [],
                interactions: defaults({
                    zoomDelta: optionsRef.current.zoomDelta,
                    doubleClickZoom: optionsRef.current.enableDoubleClickZoom,
                    dragPan: optionsRef.current.enableDragPan,
                    mouseWheelZoom: optionsRef.current.enableMouseWheelZoom,
                }),
            };

            const newMap = new Map(options);
            setMap(newMap);
            newMap.setTarget(mapContainerRef.current);

            return () => {
                newMap.getAllLayers().forEach((layer) => {
                    newMap.removeLayer(layer);
                });
                newMap.setTarget(undefined);
            };
        },
        [setMap],
    );

    useEffect(() => {
        if (!map) {
            return;
        }

        map.getView().setMinZoom(
            Math.min(
                zoom,
                minZoom,
            ),
        );
        map.getView().setMaxZoom(
            Math.max(
                zoom,
                maxZoom,
            ),
        );
        map.getView().setZoom(zoom);
    }, [map, zoom, minZoom, maxZoom]);

    useEffect(() => {
        if (!map) return;

        map.getControls().forEach((control) => {
            if (control instanceof OverviewMap) {
                map.removeControl(control);
            }
        });
    }, [map]);

    // center change handler
    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center);
    }, [map, center]);

    useEffect(() => {
        if (!map) {
            return;
        }
        map.getInteractions().forEach((interaction) => {
            if (interaction instanceof MouseWheelZoom) {
                interaction.setActive(enableMouseWheelZoom);
            } else if (interaction instanceof DragPan) {
                interaction.setActive(enableDragPan);
            } else if (interaction instanceof DoubleClickZoom) {
                interaction.setActive(enableDoubleClickZoom);
            }
        });
    }, [map, enableDoubleClickZoom, enableDragPan, enableMouseWheelZoom]);

    useEffect(() => {
        const currentTarget = zoomContainerRef.current;
        if (!map || !enableZoomControls || !currentTarget) {
            return undefined;
        }

        const zoomControl = new Zoom({
            delta: zoomDelta,
            target: zoomContainerRef.current,
        });

        map.addControl(zoomControl);

        return () => {
            map.removeControl(zoomControl);
        };
    }, [map, zoomDelta, enableZoomControls]);

    useEffect(
        () => {
            const currentTarget = scaleContainerRef.current;
            if (!map || !showScale || isNotDefined(currentTarget)) {
                return undefined;
            }

            const scaleControl = new ScaleLine({
                units: scaleUnits,
                bar: scaleBar,
                target: currentTarget,
            });

            map.addControl(scaleControl);

            return () => {
                map.removeControl(scaleControl);
            };
        },
        [map, showScale, scaleUnits, scaleBar],
    );

    return (
        <div
            ref={mapContainerRef}
            className={_cs(styles.olMap, className)}
            style={{ height: mapHeight }}
        >
            {children}
            <div
                className={_cs(styles.scaleContainer, scaleBar && styles.bar)}
                ref={scaleContainerRef}
            />
            <div
                className={styles.zoomContainer}
                ref={zoomContainerRef}
            />
        </div>
    );
}

export default OlMap;

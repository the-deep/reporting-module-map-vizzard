import React, {
    useRef,
    useEffect,
    useContext,
    useMemo,
} from 'react';
import { isNotDefined } from '@togglecorp/fujs';
import { View, Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import { OverviewMap, ScaleLine, Zoom } from 'ol/control';
import {
    MouseWheelZoom,
    DragPan,
    DoubleClickZoom,
    defaults,
} from 'ol/interaction';

import MapContext from '../MapContext';
import styles from './styles.module.css';

// FIXME: Let's pass this when using it
const mapboxToken = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';

export interface Props {
    zoom: number;
    minZoom: number;
    maxZoom: number;
    center: [number, number];

    showScale?: boolean;
    showOverview?: boolean;
    scaleBar?: boolean;
    scaleUnits?: 'degrees' | 'imperial' | 'nautical' | 'metric' | 'us';
    overviewMapPosition?: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft';
    children?: React.ReactNode;
    scaleBarPosition: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft';
    enableMouseWheelZoom?: boolean,
    enableDragPan?: boolean,
    enableDoubleClickZoom?: boolean,
    enableZoomControls?: boolean,
    zoomControlsPosition: 'bottomRight' | 'topRight' | 'topLeft' | 'bottomLeft', // FIXME: check if topLeft works
    paddingBottom?: number;
}

function OlMap(props: Props) {
    const {
        children,
        zoom,
        minZoom,
        maxZoom,
        center,
        showScale,
        showOverview,
        overviewMapPosition = 'bottomRight',
        scaleUnits,
        scaleBar,
        scaleBarPosition,
        enableMouseWheelZoom,
        enableDragPan = true,
        enableDoubleClickZoom,
        enableZoomControls,
        zoomControlsPosition,
        paddingBottom = 0,
    } = props;

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const { map, setMap } = useContext(MapContext);

    const bottomRightOverview = useRef<HTMLDivElement>(null);
    const topRightOverview = useRef<HTMLDivElement>(null);
    const bottomLeftOverview = useRef<HTMLDivElement>(null);
    const topLeftOverview = useRef<HTMLDivElement>(null);
    const bottomRightControl = useRef<HTMLDivElement>(null);
    const topRightControl = useRef<HTMLDivElement>(null);
    const bottomLeftControl = useRef<HTMLDivElement>(null);
    const topLeftControl = useRef<HTMLDivElement>(null);

    const controls = useMemo(() => ({
        bottomRight: bottomRightControl,
        topRight: topRightControl,
        topLeft: topLeftControl,
        bottomLeft: bottomLeftControl,
    }), []);

    const overview = useMemo(() => ({
        bottomRight: bottomRightOverview,
        topRight: topRightOverview,
        topLeft: topLeftOverview,
        bottomLeft: bottomLeftOverview,
    }), []);

    const zoomDelta = 0.4;
    // const [overviewMap, setOverviewMap] = useState<OverviewMap | undefined>();

    const optionsRef = useRef({
        zoom,
        center,
        minZoom,
        maxZoom,
        controls,
        zoomDelta,
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

            /*
            mapObject.getControls().forEach((control) => {
                if (control instanceof ScaleLine) {
                    mapObject.removeControl(control);
                }
            });

            if (showScale) {
                let scaleClassName = 'ol-scale-line';
                if (scaleBar) {
                    scaleClassName = 'ol-scale-bar';
                }
                const control = new ScaleLine({
                    units: scaleUnits,
                    bar: scaleBar,
                    className: scaleClassName,
                    minWidth: 100,
                    target: controls[scaleBarPosition].current ?? undefined,
                });
                mapObject.addControl(control);
            }

            if (enableMouseWheelZoom) {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof MouseWheelZoom) {
                        interaction.setActive(true);
                    }
                });
            } else {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof MouseWheelZoom) {
                        interaction.setActive(false);
                    }
                });
            }

            if (enableDragPan) {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof DragPan) {
                        interaction.setActive(true);
                    }
                });
            } else {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof DragPan) {
                        interaction.setActive(false);
                    }
                });
            }

            // enableDoubleClickZoom
            if (enableDoubleClickZoom) {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof DoubleClickZoom) {
                        interaction.setActive(true);
                    }
                });
            } else {
                mapObject.getInteractions().forEach((interaction) => {
                    if (interaction instanceof DoubleClickZoom) {
                        interaction.setActive(false);
                    }
                });
            }

            if (enableZoomControls) {
                const zoomClass = `${styles.ol - zoom} ${styles[`POS-${zoomControlsPosition}`]}`;
                mapObject.addControl(new Zoom({ delta: zoomDelta, className: zoomClass }));
            }

            mapObject.getControls().forEach((control) => {
                if (control instanceof OverviewMap) {
                    mapObject.removeControl(control);
                }
            });

            if (showOverview) {
                const styleUrl = 'mapbox://styles/matthewsmawfield/clo2texcn00hs01qsf0mg6drz';
                let styleUrlParsed = styleUrl.replace('mapbox://', '');
                styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

                const layer = new TileLayer({
                    source: new XYZ({
                        url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
                        tileSize: 512,
                        // FIXME: error with preload
                        // preload: 10,
                        crossOrigin: 'anonymous',
                    }),
                });

                const overviewDiv = overview[overviewMapPosition].current;
                if (overviewDiv) {
                    overviewDiv.innerHTML = '';
                }

                const overviewMapControl = new OverviewMap({
                    // see in overviewmap-custom.html to see the custom CSS used
                    className: 'ol-overviewmap ol-custom-overviewmap',
                    layers: [
                        layer,
                    ],
                    collapsible: false,
                    collapsed: false,
                    target: overviewDiv ?? undefined,
                });
                mapObject.addControl(overviewMapControl);
                setOverviewMap(overviewMapControl);
            }

            mapObject.setTarget(mapContainerRef.current ?? undefined);
            if (setMap) {
                setMap(mapObject);
            }
            if (setMapObj) {
                setMapObj(mapObject);
            }
            return () => {
                if (overviewMap) {
                    mapObject.removeControl(overviewMap);
                }
                mapObject.getControls().forEach((control) => {
                    if (control instanceof ScaleLine) {
                        mapObject.removeControl(control);
                    }
                });
                mapObject.setTarget(undefined);
            };
            */
        },
        [setMap],
    );

    useEffect(() => {
        if (!map) {
            return;
        }
        let newMinZoom = minZoom;
        if (zoom < minZoom) newMinZoom = zoom;
        // FIXME: we removed parseFloat on setMinZoom and setMaxZoom
        map.getView().setMinZoom(newMinZoom);
        map.getView().setMaxZoom(maxZoom);
        map.getView().setZoom(zoom);
    }, [map, zoom, minZoom, maxZoom]);

    useEffect(() => {
        if (!map) return;

        map.getControls().forEach((control) => {
            if (control instanceof Zoom) {
                map.removeControl(control);
            }
        });

        if (enableZoomControls) {
            const zoomClass = `ol-zoom ${styles[`POS-${zoomControlsPosition}`]}`;
            map.addControl(new Zoom({ delta: zoomDelta, className: zoomClass }));
        }
    }, [map, enableZoomControls, zoomControlsPosition]);

    useEffect(() => {
        if (!map) return;

        map.getControls().forEach((control) => {
            if (control instanceof OverviewMap) {
                map.removeControl(control);
            }
        });

        const overviewDiv = overview[overviewMapPosition].current;
        if (overviewDiv) {
            overviewDiv.innerHTML = '';
        }

        if (showOverview) {
            const styleUrl = 'mapbox://styles/matthewsmawfield/clo2texcn00hs01qsf0mg6drz';
            let styleUrlParsed = styleUrl.replace('mapbox://', '');
            styleUrlParsed = styleUrlParsed.replace('styles/', 'styles/v1/');

            const layer = new TileLayer({
                source: new XYZ({
                    url: `https://api.mapbox.com/${styleUrlParsed}/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
                    tileSize: 512,
                    // FIXME: preload does not exist
                    // preload: 10,
                    crossOrigin: 'anonymous',
                }),
            });

            const overviewMapControl = new OverviewMap({
                // see in overviewmap-custom.html to see the custom CSS used
                className: 'ol-overviewmap ol-custom-overviewmap',
                layers: [
                    layer,
                ],
                target: overviewDiv ?? undefined,
                collapsible: false,
                collapsed: false,
            });
            map.addControl(overviewMapControl);
        }
    }, [map, overview, showOverview, overviewMapPosition]);

    // center change handler
    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center);
    }, [map, center]);

    useEffect(() => {
        if (!map) return;
        if (enableMouseWheelZoom) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof MouseWheelZoom) {
                    interaction.setActive(true);
                }
            });
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof MouseWheelZoom) {
                    interaction.setActive(false);
                }
            });
        }
    }, [map, enableMouseWheelZoom]);

    useEffect(() => {
        if (!map) return;
        if (enableDragPan) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(true);
                }
            });
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(false);
                }
            });
        }
    }, [map, enableDragPan]);

    useEffect(() => {
        if (!map) return;
        if (enableDoubleClickZoom) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(true);
                }
            });
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(false);
                }
            });
        }
    }, [map, enableDoubleClickZoom]);

    useEffect(() => {
        if (!map) return;
        map.getControls().forEach((control) => {
            if (control instanceof ScaleLine) {
                map.removeControl(control);
            }
        });
        if (showScale) {
            let scaleClassName = 'ol-scale-line';
            if (scaleBar) scaleClassName = 'ol-scale-bar';
            const control = new ScaleLine({
                units: scaleUnits,
                bar: scaleBar,
                className: scaleClassName,
                minWidth: 100,
                target: controls[scaleBarPosition].current ?? undefined,
            });
            map.addControl(control);
        }
    }, [map, controls, showScale, scaleUnits, scaleBar, scaleBarPosition]);

    return (
        <div
            ref={mapContainerRef}
            className={styles.olMap}
        >
            {children}
            <div
                id="bottomRight"
                style={{ paddingBottom: paddingBottom - 20 }}
                className={styles.mapBottomRight}
            >
                <div
                    className="overview"
                    ref={bottomRightOverview}
                />
                <div
                    className="scale"
                    ref={bottomRightControl}
                />
            </div>
            <div
                id="topRight"
                className={styles.mapTopRight}
            >
                <div
                    className="scale"
                    ref={topRightControl}
                />
                <div
                    className="overview"
                    ref={topRightOverview}
                />
            </div>
            <div
                id="topLeft"
                className={styles.mapTopLeft}
            >
                <div
                    className={styles.scale}
                    ref={topLeftControl}
                />
                <div
                    className="overview"
                    ref={topLeftOverview}
                />
            </div>
            <div
                id="bottomLeft"
                style={{ paddingBottom: paddingBottom - 30 }}
                className={styles.mapBottomLeft}
            >
                <div
                    className="overview"
                    style={{ paddingBottom: 2 }}
                    ref={bottomLeftOverview}
                />
                <div
                    className="scale"
                    style={{ marginTop: 3, marginBottom: 2 }}
                    ref={bottomLeftControl}
                />
            </div>
        </div>
    );
}

export default OlMap;

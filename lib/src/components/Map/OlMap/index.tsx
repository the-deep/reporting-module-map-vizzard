import React, { useRef, useEffect, useState } from 'react';
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
import styles from './styles.module.css';

// FIXME: Let's pass this when using it
const mapboxToken = 'pk.eyJ1IjoibWF0dGhld3NtYXdmaWVsZCIsImEiOiJDdFBZM3dNIn0.9GYuVHPIaUZ2Gqjsk1EtcQ';

interface Props {
    map: Map | undefined;
    setMap: (map: Map | undefined) => void;
    setMapObj: (map: Map) => void;
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
        setMapObj,
        setMap,
        map,
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

    const mapRef = useRef<HTMLDivElement>(null);

    const bottomRightOverview = useRef<HTMLDivElement>(null);
    const topRightOverview = useRef<HTMLDivElement>(null);
    const bottomLeftOverview = useRef<HTMLDivElement>(null);
    const topLeftOverview = useRef<HTMLDivElement>(null);
    const bottomRightControl = useRef<HTMLDivElement>(null);
    const topRightControl = useRef<HTMLDivElement>(null);
    const bottomLeftControl = useRef<HTMLDivElement>(null);
    const topLeftControl = useRef<HTMLDivElement>(null);

    const controls = {
        bottomRight: bottomRightControl,
        topRight: topRightControl,
        topLeft: topLeftControl,
        bottomLeft: bottomLeftControl,
    };
    const overview = {
        bottomRight: bottomRightOverview,
        topRight: topRightOverview,
        topLeft: topLeftOverview,
        bottomLeft: bottomLeftOverview,
    };

    const zoomDelta = 0.4;
    const [overviewMap, setOverviewMap] = useState<OverviewMap | undefined>();

    // on component mount
    useEffect(() => {
        const options = {
            view: new View({
                zoom,
                center,
                minZoom,
                maxZoom,
            }),
            layers: [],
            overlays: [],
            controls: [],
            interactions: defaults({
                zoomDelta,
            }),
        };

        const mapObject = new Map(options);

        mapObject.getControls().forEach((control) => {
            if (control instanceof ScaleLine) {
                mapObject.removeControl(control);
            }
        }, this);

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
            }, this);
        } else {
            mapObject.getInteractions().forEach((interaction) => {
                if (interaction instanceof MouseWheelZoom) {
                    interaction.setActive(false);
                }
            }, this);
        }

        if (enableDragPan) {
            mapObject.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(true);
                }
            }, this);
        } else {
            mapObject.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(false);
                }
            }, this);
        }

        // enableDoubleClickZoom
        if (enableDoubleClickZoom) {
            mapObject.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(true);
                }
            }, this);
        } else {
            mapObject.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(false);
                }
            }, this);
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

        mapObject.setTarget(mapRef.current ?? undefined);
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
            }, this);
            mapObject.setTarget(undefined);
        };
    }, []);

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
    }, [zoom, minZoom, maxZoom]);

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
    }, [enableZoomControls, zoomControlsPosition]);

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
    }, [showOverview, overviewMapPosition]);

    // center change handler
    useEffect(() => {
        if (!map) return;
        map.getView().setCenter(center);
    }, [JSON.stringify(center)]);

    useEffect(() => {
        if (!map) return;
        if (enableMouseWheelZoom) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof MouseWheelZoom) {
                    interaction.setActive(true);
                }
            }, this);
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof MouseWheelZoom) {
                    interaction.setActive(false);
                }
            }, this);
        }
    }, [enableMouseWheelZoom]);

    useEffect(() => {
        if (!map) return;
        if (enableDragPan) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(true);
                }
            }, this);
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DragPan) {
                    interaction.setActive(false);
                }
            }, this);
        }
    }, [enableDragPan]);

    useEffect(() => {
        if (!map) return;
        if (enableDoubleClickZoom) {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(true);
                }
            }, this);
        } else {
            map.getInteractions().forEach((interaction) => {
                if (interaction instanceof DoubleClickZoom) {
                    interaction.setActive(false);
                }
            }, this);
        }
    }, [enableDoubleClickZoom]);

    useEffect(() => {
        if (!map) return;
        map.getControls().forEach((control) => {
            if (control instanceof ScaleLine) {
                map.removeControl(control);
            }
        }, this);
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
    }, [showScale, scaleUnits, scaleBar, scaleBarPosition]);

    return (
        <div
            ref={mapRef}
            className="ol-map"
            style={{ height: '100%' }}
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
                    className="scale"
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

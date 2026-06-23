import { FC, ReactNode, useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { Icons } from "@ui";
import { Cartomancer, useMachineWard, glitchmitter } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './map-tools.module.css';
import './map.css';

interface Props {
    map: maplibregl.Map;
    /**
     * Will be unmounted for the duration of style updates.
     */
    children?: ReactNode;
}

export const MapTools: FC<Props> = ({ map, children }) => {
    const { cartomancer, toolsStation } = useMachineWard<maplibregl.Map>();
    const [gaugeControls] = useSubjectState(cartomancer.gaugeControls$);
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const [cssLoaded, setCssLoaded] = useState(false);
    const [isInitialised, setIsInitialised] = useSubjectState(cartomancer.isInitialised$);
    const [isStyleLoaded, setIsStyleLoaded] = useSubjectState(cartomancer.isStyleLoaded$);
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);

    /**
     * Safely updates style and resolves when the `map.isStyleLoaded()` check resolves.
     */
    const updateStyle = async (
        map: maplibregl.Map,
        style: string | maplibregl.StyleSpecification,
        abortSignal: AbortSignal,
        onError?: (err: unknown) => void
    ) => {
        try {
            setIsStyleLoaded(false);
            map.setStyle(style);
            await validateStyleLoaded(map, abortSignal);
            setIsStyleLoaded(true);
        } catch (err) {
            onError?.(err);
        }
    };

    /**
     * Subscribes to map `idle` events and resolves when `map.isStyleLoaded()` resolves.
     */
    const validateStyleLoaded = (
        map: maplibregl.Map,
        abortSignal: AbortSignal
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            const isLoadedHandler = (_event: maplibregl.MapDataEvent) => {
                if (abortSignal.aborted) {
                    map.off('idle', isLoadedHandler);
                    reject("User aborted map style validation.")
                } else
                    if (map.isStyleLoaded()) {
                        map.off('idle', isLoadedHandler);
                        resolve();
                    }
            }

            map.on('idle', isLoadedHandler);
        });
    };

    useEffect(() => {
        const abortController = new AbortController();
        const head = document.getElementsByTagName('head')?.[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.onload = () => setCssLoaded(true);
        link.onerror = (err) => glitchmitter.transmit(err);
        link.href = `https://unpkg.com/maplibre-gl@${maplibregl.getVersion()}/dist/maplibre-gl.css`;
        head.appendChild(link);

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        if (!containerRef || !cssLoaded) {
            return;
        }
        const mapContainer = map.getContainer();
        containerRef.appendChild(mapContainer);
        const protocolId = 'pmtiles';
        const protocol = new Protocol();
        maplibregl.addProtocol(protocolId, protocol.tile);

        setIsInitialised(true);

        return () => {
            maplibregl.removeProtocol(protocolId);
            containerRef.removeChild(mapContainer);
        };
    }, [containerRef, cssLoaded]);

    useEffect(() => {
        if (!isInitialised) {
            return;
        }
        const resizeHandler = () => {
            map.resize();
        };
        window.addEventListener('resize', resizeHandler);
        map.resize();

        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [isInitialised]);

    useEffect(() => {
        const zoomHandler = () => {
            cartomancer.zoom$.next(map.getZoom());
        };
        map.on("zoomend", zoomHandler);

        const rotateHandler = () => {
            cartomancer.bearing$.next(map.getBearing());
        };
        map.on("rotate", rotateHandler);

        return () => {
            map.off("zoomend", zoomHandler);
            map.off("rotate", rotateHandler);
        };
    }, []);

    useEffect(() => {
        if (!isStyleLoaded) {
            return;
        }
        map.setProjection({ type: gaugeControls.globeProjection ? 'globe' : 'mercator' });
        map.resize();

        const projectionHandler = () => {
            if (map.isStyleLoaded()) {
                map.setProjection({ type: gaugeControls.globeProjection ? 'globe' : 'mercator' });
                map.resize()
            }
        };
        map.on('style.load', projectionHandler);

        return () => {
            map.off('style.load', projectionHandler);
        };
    }, [isStyleLoaded, gaugeControls.globeProjection]);

    useEffect(() => {
        const nextStyle = Cartomancer.styles[selectedStyle.id];
        if (!nextStyle) {
            return;
        }

        const abortController = new AbortController();
        updateStyle(map, nextStyle.style, abortController.signal, (err) => {
            if (!abortController.signal.aborted) {
                glitchmitter.transmit(err)
            }
        });

        return () => {
            abortController.abort();
        };
    }, [selectedStyle.id]);

    useEffect(() => {
        if (!isInitialised) {
            return;
        }
        (async () => {
            if (!map.hasImage('placeholder')) {
                const image = new Image();
                const promise = new Promise((resolve) => {
                    image.onload = resolve;
                });
                image.src = Icons.NounProject.AlienGun;
                await promise;
                image.width = 20;
                image.height = 20;
                map.addImage('placeholder', image);
            }
        })();

        return () => {
            if (map.hasImage('placeholder')) {
                map.removeImage('placeholder');
            }
        };
    }, [isInitialised]);

    const clickedZoom = useRef(map.getZoom());

    useEffect(() => {
        if (!gaugeControls.showCompass) {
            return;
        }
        const id = 'cartomancer-compass';
        const toolIcon = toolsStation.addToolIcon(id, {
            icon: Icons.NounProject.North,
            onClick: (map) => {
                map.setBearing(0);
                map.setPitch(0);
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.Compass },
        });

        const rotateHandler = () => {
            toolIcon.rotate$.next(Math.round(map.getBearing()));
        };
        const pitchHandler = () => {
            toolIcon.pitch$.next(Math.round(map.getPitch()));
        };

        map.on('rotate', rotateHandler);
        map.on('pitch', pitchHandler);

        return () => {
            map.off('rotate', rotateHandler);
            map.off('pitch', pitchHandler);
            toolsStation.removeToolIcon(id);
        };
    }, [gaugeControls.showCompass]);

    useEffect(() => {
        if (!gaugeControls.showZoomButtons) {
            return;
        }
        const idIn = 'cartomancer-zoom-in';
        toolsStation.addToolIcon(idIn, {
            icon: Icons.NounProject.Plus,
            onClick: (map) => {
                clickedZoom.current = Math.max(clickedZoom.current + 1, Math.floor(map.getZoom() + 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomIn },
        });

        const idCurrentZoom = 'cartomancer-current-zoom';
        const currentZoomIcon = toolsStation.addToolIcon(idCurrentZoom, {
            value: map.getZoom().toFixed(1),
            onClick: (map) => {
                map.easeTo({ zoom: Math.round(map.getZoom()) });
            },
            placement: 'right',
            tooltip: (value) => ({
                n: cartomancer.namespace,
                t: cartomancer.translationKey.RoundCurrentZoom,
                p: typeof value === 'string' ? { zoom: Number(value).toFixed(0) } : undefined,
            }),
        });

        const idOut = 'cartomancer-zoom-out';
        toolsStation.addToolIcon(idOut, {
            icon: Icons.NounProject.Minus,
            onClick: (map) => {
                clickedZoom.current = Math.min(clickedZoom.current - 1, Math.ceil(map.getZoom() - 1));
                map.easeTo({ zoom: clickedZoom.current });
            },
            placement: 'right',
            tooltip: { n: cartomancer.namespace, t: cartomancer.translationKey.ZoomOut },
        });

        let timeout: number;
        const zoomEndHandler = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => clickedZoom.current = map.getZoom(), 200);
            currentZoomIcon.value$.next(map.getZoom().toFixed(1));
        };

        map.on("zoomend", zoomEndHandler);

        return () => {
            map.off("zoomend", zoomEndHandler);
            toolsStation.removeToolIcon(idIn);
            toolsStation.removeToolIcon(idCurrentZoom);
            toolsStation.removeToolIcon(idOut);
        };
    }, [gaugeControls.showZoomButtons]);

    return (
        <div ref={setContainerRef} className={styles["container"]}>
            {isStyleLoaded ? children : null}
        </div>
    );
};

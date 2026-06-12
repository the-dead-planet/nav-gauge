import { FC, ReactNode, useState, useEffect, CSSProperties, useMemo } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import classNames from "classnames";
import { Icons } from "@ui";
import { Cartomancer, useMachineWard, ToolsStation, glitchmitter } from "@apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
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
    const { cartomancer, toolsStation } = useMachineWard();
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
        const showControls = gaugeControls.showZoomButtons || gaugeControls.showCompass;
        if (!isInitialised || !showControls) {
            return;
        }
        const resizeHandler = () => {
            map.resize();
        };
        // TODO: Observer parent
        window.addEventListener('resize', resizeHandler);
        const control = new maplibregl.NavigationControl({
            showZoom: gaugeControls.showZoomButtons,
            showCompass: gaugeControls.showCompass,
            visualizePitch: true
        });
        map.addControl(control, gaugeControls.controlPosition);
        map.resize();

        return () => {
            map.removeControl(control);
            window.removeEventListener('resize', resizeHandler);
        };
    }, [isInitialised, gaugeControls.showZoomButtons, gaugeControls.showCompass, gaugeControls.controlPosition]);

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
                image.src = Icons.Find;
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

    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);

    const controlsCssStyle = useMemo(
        () => {
            const { top, bottom, right, left } = gaugeControls.controlPlacement;

            switch (gaugeControls.controlPosition) {
                case 'top-left': return { '--ctrl-top': top + 'px', '--ctrl-left': left + 'px' }
                case 'top-right': return { '--ctrl-top': top + 'px', '--ctrl-right': right + 'px' }
                case 'bottom-left': return { '--ctrl-bottom': bottom + 'px', '--ctrl-left': left + 'px' }
                case 'bottom-right': return { '--ctrl-bottom': bottom + 'px', '--ctrl-right': right + 'px' }
            }
        },
        [gaugeControls]
    );

    return (
        <div ref={setContainerRef} className={styles["container"]}  style={{
            ...controlsCssStyle,
        } as unknown as CSSProperties}>
            {/* {ToolsStation.placements.map((p) => (
                <div key={p} className={classNames(styles["toolbox"], styles[p])}>
                    {toolsByPlacement[p].map(({ id, component: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </div>
            ))} */}
            {isStyleLoaded ? children : null}
        </div>
    );
};

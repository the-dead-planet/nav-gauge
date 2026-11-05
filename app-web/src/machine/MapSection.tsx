import type * as maplibregl from "maplibre-gl";
import { FC, useEffect, useState } from "react";
import { useMapSection, useSelectedStyleTheme } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapCanvas } from "./map-canvas/MapCanvas";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import { Popups } from "./Popups";
import { createMap } from "./map";
import { ErrorBoundary, ThemeContext } from "@ui";
import styles from './machine.module.css';

export const MapSection: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { cartomancer } = useWebMachineWard();
    const selectedStyleTheme = useSelectedStyleTheme(cartomancer);
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const { handleError } = useMapSection();

    useEffect(() => {
        const m = createMap();
        setMap(m);
        cartomancer.map = m;

        return () => {
            cartomancer.map = null;
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);

    return (
        <div className={styles.machine}>
            <GearsTopToolbar />
            {map ? (
                <ErrorBoundary onError={handleError}>
                    <ThemeContext.Provider value={selectedStyleTheme}>
                        <MapCanvas map={map}>
                            {[...overlays.entries()].map(([id, OverlayComponent]) => (
                                <ErrorBoundary key={id} onError={handleError}>
                                    <OverlayComponent key={id} map={map} />
                                </ErrorBoundary>
                            ))}
                        </MapCanvas>
                        <ErrorBoundary onError={handleError}>
                            <Popups map={map} />
                        </ErrorBoundary>
                    </ThemeContext.Provider>
                </ErrorBoundary>
            ) : null}
            <MapToolsGridAreas map={map} selectedStyleTheme={selectedStyleTheme} />
        </div>
    );
};

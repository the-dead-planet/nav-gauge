import { FC, useEffect, useState } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapCanvas } from "./map-canvas/MapCanvas";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import { createMap } from "./map";
import { ErrorBoundary } from "@ui";
import styles from './machine.module.css';

export const MapSection: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { cartomancer, signaliumBureau } = useMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);

    useEffect(() => {
        const m = createMap();
        setMap(m);

        return () => {
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);


    const handleError = (error: Error | null) => {
        const msg = 'Something went wrong while rendering the map';

        signaliumBureau.addNotice({
            id: 'map-section',
            type: 'error',
            error: error || new Error(msg),
            text: error?.message || msg,
        })
    };

    return (
        <div className={styles.machine}>
            <GearsTopToolbar />
            {map ? (
                <ErrorBoundary onError={handleError}>
                    <MapCanvas map={map}>
                        {[...overlays.entries()].map(([id, OverlayComponent]) => (
                            <ErrorBoundary onError={handleError}>
                                <OverlayComponent key={id} map={map} />
                            </ErrorBoundary>
                        ))}
                    </MapCanvas>
                </ErrorBoundary>
            ) : null}
            <MapToolsGridAreas map={map} />
        </div>
    );
};

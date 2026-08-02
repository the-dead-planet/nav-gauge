import { FC, useEffect, useState } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapCanvas } from "./map/MapCanvas";
import { MapToolsGridAreas } from "./map-tools-grid/MapToolsGridAreas";
import { GearsTopToolbar } from "./GearsTopToolbar";
import { createMap } from "./map";
import styles from './machine.module.css';

export const MapSection: FC = () => {
    const [map, setMap] = useState<maplibregl.Map>();
    const { cartomancer } = useMachineWard();
    const [overlays] = useSubjectState(cartomancer.overlays$);

    useEffect(() => {
        const m = createMap();
        setMap(m);

        return () => {
            setMap(undefined);
            requestAnimationFrame(() => m.remove());
        };
    }, []);

    return (
        <div className={styles.machine}>
            <GearsTopToolbar />
            {map ? (
                <MapCanvas map={map}>
                    {[...overlays.entries()].map(([id, OverlayComponent]) => <OverlayComponent key={id} map={map} />)}
                </MapCanvas>
            ) : null}
            <MapToolsGridAreas map={map} />
        </div>
    );
};

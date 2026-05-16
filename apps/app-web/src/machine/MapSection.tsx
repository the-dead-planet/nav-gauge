import { useMemo } from "react";
import { useStateWarden } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MapTools } from "./map-tools/MapTools";
import { createMap } from "./map";

export const MapSection: React.FC = () => {
    const map = useMemo(() => createMap(), []);
    const { cartomancer } = useStateWarden();
    const [overlays] = useSubjectState(cartomancer.overlays$);

    return (
        <MapTools map={map}>
            {[...overlays.entries()].map(([id, OverlayComponent]) => <OverlayComponent key={id} map={map} />)}
        </MapTools>
    );
};

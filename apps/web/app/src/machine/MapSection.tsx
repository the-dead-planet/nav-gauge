import { useEffect, useMemo, useState } from "react";
import { GeoJson, MarkerImage, useStateWarden, useSubjectState } from "@apparatus";
import { RouteTimes } from "@tinker-chest";
import { MapTools } from "./map-tools/MapTools";
import { RouteLayerFitBounds } from "./layers/RouteLayerFitBounds";
import { Player } from "./player/Player";
import { createMap } from "../map";

interface Props {
    geojson?: GeoJson;
    boundingBox?: GeoJSON.BBox;
    images: MarkerImage[];
    onUpdateImageFeatureId: (imageId: number, featureId: number) => void;
    routeTimes?: RouteTimes;
}

export const MapSection: React.FC<Props> = ({
    geojson,
    boundingBox,
    images,
    onUpdateImageFeatureId,
    routeTimes,
}) => {
    const map = useMemo(() => createMap(), []);
    const { cartomancer } = useStateWarden();
    const [overlays] = useSubjectState(cartomancer.overlays$);
    const [progressMs, setProgressMs] = useState(0);

    useEffect(() => setProgressMs(0), [geojson]);

    return (
        <MapTools
            map={map}
            toolsLeft={<RouteLayerFitBounds map={map} boundingBox={boundingBox} />}
            toolsBottom={<Player
                map={map}
                geojson={geojson}
                images={images}
                routeTimes={routeTimes}
                progressMs={progressMs}
                onProgressMsChange={setProgressMs}
            />}
        >
            {geojson && boundingBox && routeTimes
                ? <>
                    {overlays.map((overlay) => (
                        <overlay.component
                            key={overlay.id}
                            map={map}
                            geojson={geojson}
                            images={images}
                            routeTimes={routeTimes}
                            progressMs={progressMs}
                            onProgressMsChange={setProgressMs}
                            onUpdateImageFeatureId={onUpdateImageFeatureId}
                        />
                    ))}
                </>
                : null}
        </MapTools>
    );
};

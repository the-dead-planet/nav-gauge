import { useEffect, useState } from "react";
import type { Map } from "maplibre-gl";
import { useSubjectState } from "@tinker-chest";
import {
    expandedImageGroupId$,
    getGroupedImageSource,
    getImageSource,
    selectedImageId$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const useImageMarkerSource = (
    map: Map,
    source: ReturnType<typeof getImageSource>,
    isDisplayingImage: boolean,
) => {
    const [selectedImageId] = useSubjectState(selectedImageId$);
    const [expandedImageGroupId] = useSubjectState(expandedImageGroupId$);
    const [groupedSource, setGroupedSource] = useState(source);

    useEffect(() => {
        let active = true;
        let revision = 0;
        const update = async () => {
            const currentRevision = ++revision;
            const grouped = await getGroupedImageSource(
                source,
                (coordinate) => {
                    const point = map.project(coordinate);
                    return [point.x, point.y];
                },
                (point) => {
                    const coordinate = map.unproject(point);
                    return [coordinate.lng, coordinate.lat];
                },
                selectedImageId,
                isDisplayingImage || map.isMoving()
                    ? null
                    : expandedImageGroupId,
            );
            if (active && revision === currentRevision) {
                setGroupedSource(grouped);
            }
        };
        void update();
        map.on("movestart", update);
        map.on("moveend", update);
        map.on("resize", update);
        return () => {
            active = false;
            map.off("movestart", update);
            map.off("moveend", update);
            map.off("resize", update);
        };
    }, [map, source, selectedImageId, expandedImageGroupId, isDisplayingImage]);

    return groupedSource;
};

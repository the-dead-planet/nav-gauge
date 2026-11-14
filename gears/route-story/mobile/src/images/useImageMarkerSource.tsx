import { useEffect, useRef, useState } from "react";
import { debounceTime, combineLatest, tap } from "rxjs";
import { useMobileMachineWard, MobileMap } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    expandedImageGroupId$,
    getGroupedImageSource,
    getImageSource,
    getImageSourceWithAnchors,
    selectedImageId$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MapImageHitTarget } from "./model";

export const useImageMarkerSource = (
    map: MobileMap,
    source: ReturnType<typeof getImageSource>,
    isDisplayingImage: boolean,
) => {
    const { cartomancer } = useMobileMachineWard();
    const [selectedImageId] = useSubjectState(selectedImageId$);
    const [expandedImageGroupId] = useSubjectState(expandedImageGroupId$);
    const [groupedSource, setGroupedSource] = useState(source);
    const hitTargets = useRef<MapImageHitTarget[]>([]);

    useEffect(() => {
        let active = true;
        let revision = 0;
        const subscription = combineLatest([
            map.map$,
            map.mapSize$,
            map.cameraMoving$,
            cartomancer.zoom$,
            cartomancer.bearing$,
        ])
            .pipe(
                tap(() => {
                    revision++;
                    hitTargets.current = [];
                }),
                debounceTime(100),
            )
            .subscribe(async () => {
                const mapRef = map.map$.value;
                if (!mapRef || map.cameraMoving$.value) {
                    return;
                }
                const currentRevision = revision;
                try {
                    // Reuse grouping projections so touch ownership never waits on a native query.
                    const positions = new Map<string, [number, number]>();
                    const grouped = await getGroupedImageSource(
                        source,
                        async (coordinate) => {
                            const point = await mapRef.project(coordinate);
                            positions.set(coordinate.join(","), point);
                            return point;
                        },
                        async (point) => {
                            const coordinate = await mapRef.unproject(point);
                            positions.set(coordinate.join(","), point);
                            return coordinate;
                        },
                        selectedImageId,
                        isDisplayingImage ? null : expandedImageGroupId,
                    );
                    if (active && revision === currentRevision) {
                        const routePositions = new Map(
                            source.features.map((feature) => [
                                feature.properties.imageId,
                                positions.get(feature.geometry.coordinates.join(",")),
                            ]),
                        );
                        hitTargets.current = getImageSourceWithAnchors(source, grouped).features.flatMap(
                            (feature): MapImageHitTarget[] => {
                                const point = positions.get(feature.geometry.coordinates.join(","));
                                const routePoint = routePositions.get(feature.properties.imageId);
                                return feature.properties.markerVisible && point && routePoint
                                    ? [{ feature, point, routePoint }]
                                    : [];
                            },
                        );
                        setGroupedSource(grouped);
                    }
                } catch {
                    // Projection can finish after the native map has been detached.
                }
            });
        return () => {
            active = false;
            hitTargets.current = [];
            subscription.unsubscribe();
        };
    }, [map, source, cartomancer, selectedImageId, expandedImageGroupId, isDisplayingImage]);

    return { groupedSource, hitTargets };
};

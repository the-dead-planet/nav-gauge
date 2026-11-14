import { useEffect, useState } from "react";
import { debounceTime, combineLatest } from "rxjs";
import { useMobileMachineWard, MobileMap } from "@mobile-apparatus";
import { useSubjectState } from "@tinker-chest";
import {
    expandedImageGroupId$,
    getGroupedImageSource,
    getImageSource,
    selectedImageId$,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const useImageMarkerSource = (
    map: MobileMap,
    source: ReturnType<typeof getImageSource>,
    isDisplayingImage: boolean,
) => {
    const { cartomancer } = useMobileMachineWard();
    const [selectedImageId] = useSubjectState(selectedImageId$);
    const [expandedImageGroupId] = useSubjectState(expandedImageGroupId$);
    const [groupedSource, setGroupedSource] = useState(source);

    useEffect(() => {
        let active = true;
        let revision = 0;
        const subscription = combineLatest([
            map.map$,
            map.mapSize$,
            cartomancer.zoom$,
            cartomancer.bearing$,
        ])
            .pipe(debounceTime(100))
            .subscribe(async () => {
                const mapRef = map.map$.value;
                if (!mapRef) {
                    return;
                }
                const currentRevision = ++revision;
                try {
                    const grouped = await getGroupedImageSource(
                        source,
                        (coordinate) => mapRef.project(coordinate),
                        (point) => mapRef.unproject(point),
                        selectedImageId,
                        isDisplayingImage ? null : expandedImageGroupId,
                    );
                    if (active && revision === currentRevision) {
                        setGroupedSource(grouped);
                    }
                } catch {
                    // Projection can finish after the native map has been detached.
                }
            });
        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, [
        map,
        source,
        cartomancer,
        selectedImageId,
        expandedImageGroupId,
        isDisplayingImage,
    ]);

    return groupedSource;
};

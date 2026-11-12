import { FC } from "react";
import { BehaviorSubject } from 'rxjs';
import { useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@web-ui";
import { Icons } from "@ui";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    state$: BehaviorSubject<RouteStoryState>;
}

export const MarkerButton: FC<Props> = ({
    gearId,
    translationKey,
    state$,
}) => {
    const [{ markerPlayerVisibility: showImageMarkers }, setState] = useSubjectState(
        state$,
    );

    const [showImageMarkerLabel, hideImageMarkerLabel, markersCaption] =
        useMultipleTranslations([
            { n: gearId, t: translationKey.ShowImageMarkers },
            { n: gearId, t: translationKey.HideImageMarkers },
            { n: gearId, t: translationKey.Markers },
        ]);

    const markersLabel = showImageMarkers
        ? hideImageMarkerLabel
        : showImageMarkerLabel;

    return (
        <Button
            icon={
                showImageMarkers
                    ? Icons.NounProject.ImageMarker
                    : Icons.NounProject.ImageMarkerHidden
            }
            size="md"
            variant="ghost"
            corners="circle"
            color={showImageMarkers ? "tertiary" : "neutral"}
            highlightColor="tertiary"
            highlighted={showImageMarkers}
            aria-label={markersLabel}
            aria-pressed={showImageMarkers}
            caption={markersCaption}
            tooltip={markersLabel}
            tooltipPlacement="top"
            onClick={() =>
                setState((previous) => ({
                    ...previous,
                    markerPlayerVisibility: !previous.markerPlayerVisibility,
                }))
            }
        />
    );
};

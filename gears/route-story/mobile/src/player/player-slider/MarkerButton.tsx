import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button } from "@mobile-ui";
import { Icons } from "@ui";
import { MobilePlayerOperator } from "../../model";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    playerOperator: MobilePlayerOperator;
}

export const MarkerButton: FC<Props> = ({
    gearId,
    translationKey,
    playerOperator,
}) => {
    const [{ showImageMarkers }, setMarkerVisibility] = useSubjectState(
        playerOperator.markerVisibility$,
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
            accessibilityLabel={markersLabel}
            accessibilityState={{ selected: showImageMarkers }}
            caption={markersCaption}
            tooltip={markersLabel}
            tooltipPlacement="top"
            onPress={() =>
                setMarkerVisibility((previous) => ({
                    ...previous,
                    showImageMarkers: !previous.showImageMarkers,
                }))
            }
        />
    );
};

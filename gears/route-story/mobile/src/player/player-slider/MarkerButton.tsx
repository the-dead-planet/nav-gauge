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
    const [showImageMarkers, setShowImageMarkers] = useSubjectState(playerOperator.showImageMarkers$);

    const [
        showImageMarkerLabel,
        hideImageMarkerLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.ShowImageMarkers },
        { n: gearId, t: translationKey.HideImageMarkers },
    ]);

    const markersLabel = showImageMarkers ? hideImageMarkerLabel : showImageMarkerLabel;

    return (
        <Button
            icon={Icons.NounProject.ImageMarker}
            size="md"
            variant="ghost"
            corners="circle"
            color={showImageMarkers ? 'tertiary' : 'neutral'}
            highlightColor="tertiary"
            accessibilityLabel={markersLabel}
            tooltip={markersLabel}
            tooltipPlacement="top"
            onPress={() => setShowImageMarkers((prev) => !prev)}
        />
    );
};

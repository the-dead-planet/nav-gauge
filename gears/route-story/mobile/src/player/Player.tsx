import { FC } from "react";
import { View } from "react-native";
import { DocumentPickerResponse } from "@react-native-documents/picker";
import { OverlayComponentProps, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { getProgressPercentage, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Divider } from "@mobile-ui";
import { currentPointRef$, linesRef$ } from "../layers/RouteLayer";
import { MobileMarkerImageData } from "../images/image-parser";
import { MobileMap } from "@mobile-apparatus";
import { RecordingButtons } from "./RecordingButtons";
import { PlayerSlider } from "./player-slider/PlayerSlider";
import { ConfigurationButtons } from "./ConfigurationButtons";

export const Player: FC<OverlayComponentProps<MobileMap> & RouteStoryProps<MobileMap, DocumentPickerResponse, MobileMarkerImageData>> = ({
    gearId,
    translationKey,
    map,
    data$,
    images$,
    state$,
    routeTimes$,
    progressMs$,
    playerOperator,
}) => {
    const [routeTimes] = useSubjectState(routeTimes$);
    const [progressMs] = useSubjectState(progressMs$);
    const { chronoLens, individuator } = useMachineWard();
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);

    const handleProgressChange = (value: number) => {
        playerOperator.updateProgress(value, (line, currentPoint) => {
            linesRef$.next(line);
            currentPointRef$.next(currentPoint);
        });
    };

    const progressPercentage = getProgressPercentage(progressMs, routeTimes);

    return (
        <View style={{
            height: 70,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 10,
        }}>
            <RecordingButtons
                gearId={gearId}
                translationKey={translationKey}
                map={map}
                playerOperator={playerOperator}
            />
            <Divider color="neutral" orientation="vertical" mh="xs" />
            <PlayerSlider
                gearId={gearId}
                translationKey={translationKey}
                map={map}
                data$={data$}
                routeTimes$={routeTimes$}
                images$={images$}
                progressMs$={progressMs$}
                playerOperator={playerOperator}
            />
            <Divider color="neutral" orientation="vertical" mh="sm" />
            <ConfigurationButtons
                gearId={gearId}
                translationKey={translationKey}
                state$={state$}
            />
        </View>
    );
};

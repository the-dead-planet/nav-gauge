import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ToolPanelProps } from "@apparatus";
import { MobileMap } from "@mobile-apparatus";
import {
    Checkbox,
    ClockDurationInput,
    ClockInput,
    ClockSliceInput,
    Dropdown,
    Fieldset,
    Icon,
    IconRotateInput,
    Slider,
    Text,
    ToggleSwitch,
} from "@mobile-ui";
import { clamp } from "@tinker-chest";
import {
    Animatrix,
    formatAnimationDuration,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, STEP_DEG } from "@ui";
import { MobileRouteStoryProps } from "../model";
import { useMobileAnimationControls } from "./useMobileAnimationControls";
import { AnimationControlRow } from "./AnimationControlRow";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        gap: 20,
        minWidth: 0,
    },
    recordingFormula: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
    },
});

export const AnimationControls: FC<
    ToolPanelProps<MobileMap> & MobileRouteStoryProps
> = ({ animatrix, images$, map }) => {
    const {
        animationControls,
        setAnimationControls,
        generalLabel,
        followCurrentPointLabel,
        autoRotateLabel,
        cameraAngleLabel,
        cameraRollLabel,
        pitchLabel,
        zoomLabel,
        imagePauseDurationLabel,
        routePlaybackDurationLabel,
        playbackPacingLabel,
        totalRecordingDurationLabel,
        easeDurationLabel,
        panToWholeRouteAtEndLabel,
        playbackPacingOptions,
        matchesSearch,
        showGeneral,
        showFollowCurrentPoint,
        displayedImageCount,
        totalRecordingDuration,
        changeZoom,
        changePitch,
    } = useMobileAnimationControls(animatrix, images$, map);
    const {
        followCurrentPoint,
        autoRotate,
        cameraAngle,
        cameraRoll,
        cameraTilt,
        cameraZoom,
        easeDuration,
        displayImageDuration,
        routePlaybackDuration,
        playbackPacing,
        panToWholeRouteAtEnd,
    } = animationControls;

    return (
        <View style={styles.container}>
            {showGeneral ? (
                <Fieldset label={generalLabel} expandable variant="outline">
                    <AnimationControlRow label={imagePauseDurationLabel}>
                        <ClockInput
                            numberInputPlacement="below"
                            ariaLabel={imagePauseDurationLabel}
                            showNumberInput
                            showStepControls
                            value={(displayImageDuration / 1000) * STEP_DEG}
                            formatValue={(angle) =>
                                `${Math.round(angle / STEP_DEG)}s`
                            }
                            min={
                                (Animatrix.displayImageDurationRange[0] /
                                    1000) *
                                STEP_DEG
                            }
                            max={
                                (Animatrix.displayImageDurationRange[1] /
                                    1000) *
                                STEP_DEG
                            }
                            step={STEP_DEG}
                            numberInputScale={STEP_DEG}
                            numberInputUnit="s"
                            onChange={(value) =>
                                setAnimationControls((previous) => ({
                                    ...previous,
                                    displayImageDuration: clamp(
                                        (value * 1000) / STEP_DEG,
                                        Animatrix.displayImageDurationRange,
                                    ),
                                }))
                            }
                        />
                    </AnimationControlRow>
                    <AnimationControlRow label={routePlaybackDurationLabel}>
                        <ClockDurationInput
                            numberInputPlacement="below"
                            ariaLabel={routePlaybackDurationLabel}
                            showNumberInput
                            showStepControls
                            value={routePlaybackDuration}
                            min={Animatrix.routePlaybackDurationRange[0]}
                            onChange={(value) =>
                                setAnimationControls((previous) => ({
                                    ...previous,
                                    routePlaybackDuration: value,
                                }))
                            }
                        />
                    </AnimationControlRow>
                    <AnimationControlRow label={playbackPacingLabel}>
                        <Dropdown
                            value={playbackPacing}
                            options={playbackPacingOptions}
                            onChange={(value) =>
                                setAnimationControls((previous) => ({
                                    ...previous,
                                    playbackPacing: value,
                                }))
                            }
                        />
                    </AnimationControlRow>
                    <AnimationControlRow label={totalRecordingDurationLabel}>
                        <View style={styles.recordingFormula}>
                            <Text tabular>
                                {formatAnimationDuration(routePlaybackDuration)}
                            </Text>
                            <Text>+</Text>
                            <Icon
                                icon={Icons.NounProject.ImageMarker}
                                width={13}
                                height={13}
                            />
                            <Text
                                tabular
                            >{`${displayedImageCount} × ${formatAnimationDuration(displayImageDuration)}`}</Text>
                            <Text
                                tabular
                            >{`= ${formatAnimationDuration(totalRecordingDuration)}`}</Text>
                        </View>
                    </AnimationControlRow>
                    <AnimationControlRow>
                        <Checkbox
                            checked={panToWholeRouteAtEnd}
                            onChange={() =>
                                setAnimationControls((previous) => ({
                                    ...previous,
                                    panToWholeRouteAtEnd:
                                        !previous.panToWholeRouteAtEnd,
                                }))
                            }
                        >
                            {panToWholeRouteAtEndLabel}
                        </Checkbox>
                    </AnimationControlRow>
                </Fieldset>
            ) : null}
            {showFollowCurrentPoint ? (
                <Fieldset
                    label={followCurrentPointLabel}
                    expandable
                    variant="outline"
                    append={
                        <ToggleSwitch
                            ariaLabel={followCurrentPointLabel}
                            checked={followCurrentPoint}
                            onChange={() =>
                                setAnimationControls((previous) => ({
                                    ...previous,
                                    followCurrentPoint:
                                        !previous.followCurrentPoint,
                                }))
                            }
                        />
                    }
                >
                    {matchesSearch(zoomLabel) ? (
                        <AnimationControlRow label={zoomLabel}>
                            <Slider
                                ariaLabel={zoomLabel}
                                value={cameraZoom}
                                step={0.1}
                                min={Animatrix.zoomRange[0]}
                                max={Animatrix.zoomRange[1]}
                                onChange={changeZoom}
                                disabled={!followCurrentPoint}
                                showNumberInput
                                showStepControls
                            />
                        </AnimationControlRow>
                    ) : null}
                    {matchesSearch(easeDurationLabel) ? (
                        <AnimationControlRow label={easeDurationLabel}>
                            <Slider
                                ariaLabel={easeDurationLabel}
                                value={easeDuration}
                                min={Animatrix.easeDurationRange[0]}
                                max={Animatrix.easeDurationRange[1]}
                                step={100}
                                onChange={(value) =>
                                    setAnimationControls((previous) => ({
                                        ...previous,
                                        easeDuration: clamp(
                                            value,
                                            Animatrix.easeDurationRange,
                                        ),
                                    }))
                                }
                                disabled={!followCurrentPoint}
                                showNumberInput
                                showStepControls
                            />
                        </AnimationControlRow>
                    ) : null}
                    {matchesSearch(autoRotateLabel) ? (
                        <AnimationControlRow>
                            <Checkbox
                                checked={autoRotate}
                                onChange={() =>
                                    setAnimationControls((previous) => ({
                                        ...previous,
                                        autoRotate: !previous.autoRotate,
                                    }))
                                }
                                disabled={!followCurrentPoint}
                            >
                                {autoRotateLabel}
                            </Checkbox>
                        </AnimationControlRow>
                    ) : null}
                    {matchesSearch(cameraAngleLabel) ? (
                        <AnimationControlRow label={cameraAngleLabel}>
                            <IconRotateInput
                                numberInputPlacement="below"
                                ariaLabel={cameraAngleLabel}
                                showNumberInput
                                showStepControls
                                valueAdjustment={-90}
                                icon={Icons.NounProject.CameraVideoSide}
                                value={cameraAngle}
                                min={Animatrix.cameraAngleRange[0]}
                                max={Animatrix.cameraAngleRange[1]}
                                onChange={(value) =>
                                    setAnimationControls((previous) => ({
                                        ...previous,
                                        cameraAngle: clamp(
                                            value,
                                            Animatrix.cameraAngleRange,
                                        ),
                                    }))
                                }
                                disabled={!followCurrentPoint}
                            />
                        </AnimationControlRow>
                    ) : null}
                    {matchesSearch(pitchLabel) ? (
                        <AnimationControlRow label={pitchLabel}>
                            <ClockSliceInput
                                numberInputPlacement="below"
                                ariaLabel={pitchLabel}
                                showNumberInput
                                showStepControls
                                value={cameraTilt}
                                min={Animatrix.cameraTiltRange[0]}
                                max={Animatrix.cameraTiltRange[1]}
                                onChange={changePitch}
                                formatValue={(angle) => `${angle}°`}
                                disabled={!followCurrentPoint}
                            />
                        </AnimationControlRow>
                    ) : null}
                    {matchesSearch(cameraRollLabel) ? (
                        <AnimationControlRow label={cameraRollLabel}>
                            <IconRotateInput
                                numberInputPlacement="below"
                                ariaLabel={cameraRollLabel}
                                showNumberInput
                                showStepControls
                                icon={Icons.NounProject.CameraVideoFront}
                                value={cameraRoll}
                                min={Animatrix.cameraRollRange[0]}
                                max={Animatrix.cameraRollRange[1]}
                                disabled
                            />
                        </AnimationControlRow>
                    ) : null}
                </Fieldset>
            ) : null}
        </View>
    );
};

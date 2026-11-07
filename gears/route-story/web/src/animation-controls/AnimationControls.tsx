import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import classNames from "classnames";
import { ToolPanelProps } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import {
    ClockInput,
    Checkbox,
    Dropdown,
    Fieldset,
    ClockSliceInput,
    ClockDurationInput,
    IconRotateInput,
    Slider,
    ToggleSwitch,
    Label,
    Span,
    Icon,
} from "@web-ui";
import {
    AnimationControlsType,
    Animatrix,
    formatAnimationDuration,
    useAnimationControls,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, STEP_DEG } from "@ui";
import { WebRouteStoryProps } from "../model";
import styles from "./animation-controls.module.css";

export const AnimationControls: FC<
    ToolPanelProps<maplibregl.Map> & WebRouteStoryProps
> = ({ map, animatrix, placement, images$ }) => {
    const { chronoLens } = useWebMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
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
    } = useAnimationControls(animatrix, images$);

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
        <div className={classNames(styles["container"], styles[placement])}>
            {showGeneral && (
                <Fieldset
                    label={generalLabel}
                    expandable
                    contentClassName={styles["fieldset"]}
                    variant="outline"
                >
                    <Label htmlFor="animation-controls-image-pause-duration">
                        {imagePauseDurationLabel}
                    </Label>
                    <div>
                        <ClockInput
                            id="animation-controls-image-pause-duration"
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
                                setAnimationControls((prev) => ({
                                    ...prev,
                                    displayImageDuration: clamp(
                                        (value * 1000) / STEP_DEG,
                                        Animatrix.displayImageDurationRange,
                                    ),
                                }))
                            }
                        />
                    </div>
                    <Label htmlFor="animation-controls-route-playback-duration">
                        {routePlaybackDurationLabel}
                    </Label>
                    <div>
                        <ClockDurationInput
                            id="animation-controls-route-playback-duration"
                            showNumberInput
                            showStepControls
                            value={routePlaybackDuration}
                            min={Animatrix.routePlaybackDurationRange[0]}
                            onChange={(value) =>
                                setAnimationControls((prev) => ({
                                    ...prev,
                                    routePlaybackDuration: value,
                                }))
                            }
                        />
                    </div>
                    <Label htmlFor="animation-controls-playback-pacing">
                        {playbackPacingLabel}
                    </Label>
                    <Dropdown
                        id="animation-controls-playback-pacing"
                        ariaLabel={playbackPacingLabel}
                        value={playbackPacing}
                        options={playbackPacingOptions}
                        onChange={(value) =>
                            setAnimationControls((previous) => ({
                                ...previous,
                                playbackPacing: value,
                            }))
                        }
                    />
                    <Label htmlFor="animation-controls-total-recording-duration">
                        {totalRecordingDurationLabel}
                    </Label>
                    <div className={styles["recording-formula"]}>
                        <Span tabular>
                            {formatAnimationDuration(routePlaybackDuration)}
                        </Span>
                        <Span className={styles["recording-formula-operator"]}>
                            +
                        </Span>
                        <Icon
                            src={Icons.NounProject.ImageMarker}
                            width={13}
                            height={13}
                        />
                        <Span
                            tabular
                        >{`${displayedImageCount} × ${formatAnimationDuration(displayImageDuration)}`}</Span>
                        <Span className={styles["recording-formula-equals"]}>
                            = {formatAnimationDuration(totalRecordingDuration)}
                        </Span>
                    </div>
                    <span />
                    <Checkbox
                        id="animation-controls-pan-to-whole-route-at-end"
                        checked={panToWholeRouteAtEnd}
                        onChange={() =>
                            setAnimationControls((prev) => ({
                                ...prev,
                                panToWholeRouteAtEnd:
                                    !prev.panToWholeRouteAtEnd,
                            }))
                        }
                    >
                        {panToWholeRouteAtEndLabel}
                    </Checkbox>
                </Fieldset>
            )}
            {showFollowCurrentPoint && (
                <Fieldset
                    label={followCurrentPointLabel}
                    variant="outline"
                    append={
                        <ToggleSwitch
                            id="animation-controls-follow-current-point"
                            aria-label={followCurrentPointLabel}
                            checked={followCurrentPoint}
                            onChange={() =>
                                setAnimationControls((prev) => ({
                                    ...prev,
                                    followCurrentPoint:
                                        !prev.followCurrentPoint,
                                }))
                            }
                        />
                    }
                    expandable
                    contentClassName={classNames(
                        styles["fieldset"],
                        styles["top-padding"],
                    )}
                >
                    {matchesSearch(zoomLabel) && (
                        <>
                            <Label htmlFor="animation-controls-zoom">
                                {zoomLabel}
                            </Label>
                            <Slider
                                id="animation-controls-zoom"
                                value={cameraZoom}
                                step={0.1}
                                min={Animatrix.zoomRange[0]}
                                max={Animatrix.zoomRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev,
                                        cameraZoom: clamp(
                                            value,
                                            Animatrix.zoomRange,
                                        ),
                                    }));
                                    if (!isPlaying) {
                                        map.setZoom(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                                showNumberInput
                                showStepControls
                            />
                        </>
                    )}
                    {matchesSearch(easeDurationLabel) && (
                        <>
                            <Label htmlFor="animation-controls-ease-duration">
                                {easeDurationLabel}
                            </Label>
                            <Slider
                                id="animation-controls-ease-duration"
                                showNumberInput
                                showStepControls
                                value={easeDuration}
                                min={Animatrix.easeDurationRange[0]}
                                max={Animatrix.easeDurationRange[1]}
                                step={100}
                                onChange={(value) =>
                                    setAnimationControls((prev) => ({
                                        ...prev,
                                        easeDuration: clamp(
                                            value,
                                            Animatrix.easeDurationRange,
                                        ),
                                    }))
                                }
                                disabled={!followCurrentPoint}
                                // formatValue={(easeDuration) => `${easeDuration}ms`}
                            />
                        </>
                    )}
                    {matchesSearch(autoRotateLabel) && (
                        <>
                            <span />
                            <Checkbox
                                id="animation-controls-auto-rotate"
                                checked={autoRotate}
                                onChange={() =>
                                    setAnimationControls((prev) => ({
                                        ...prev,
                                        autoRotate: !prev.autoRotate,
                                    }))
                                }
                                disabled={!followCurrentPoint}
                            >
                                {autoRotateLabel}
                            </Checkbox>
                        </>
                    )}
                    {matchesSearch(cameraAngleLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-angle">
                                {cameraAngleLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-angle"
                                showNumberInput
                                showStepControls
                                valueAdjustment={-90}
                                icon={Icons.NounProject.CameraVideoSide}
                                value={cameraAngle}
                                min={Animatrix.cameraAngleRange[0]}
                                max={Animatrix.cameraAngleRange[1]}
                                onChange={(value) =>
                                    setAnimationControls((prev) => ({
                                        ...prev,
                                        cameraAngle: clamp(
                                            value,
                                            Animatrix.cameraAngleRange,
                                        ),
                                    }))
                                }
                                disabled={!followCurrentPoint}
                                // formatValue={(angle) => `${angle}°`}
                            />
                        </>
                    )}
                    {matchesSearch(pitchLabel) && (
                        <>
                            <Label htmlFor="animation-controls-pitch">
                                {pitchLabel}
                            </Label>
                            <ClockSliceInput
                                id="animation-controls-pitch"
                                thumbIcon={Icons.NounProject.CameraVideoSide}
                                showNumberInput
                                showStepControls
                                value={cameraTilt}
                                min={Animatrix.cameraTiltRange[0]}
                                max={Animatrix.cameraTiltRange[1]}
                                onChange={(value) => {
                                    setAnimationControls(
                                        (prev): AnimationControlsType => ({
                                            ...prev,
                                            cameraTilt: clamp(
                                                value,
                                                Animatrix.cameraTiltRange,
                                            ),
                                        }),
                                    );
                                    if (!isPlaying) {
                                        map.setPitch(value);
                                    }
                                }}
                                formatValue={(angle) => `${angle}°`}
                                disabled={!followCurrentPoint}
                            />
                        </>
                    )}
                    {matchesSearch(cameraRollLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-roll">
                                {cameraRollLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-roll"
                                showNumberInput
                                showStepControls
                                icon={Icons.NounProject.CameraVideoFront}
                                value={cameraRoll}
                                min={Animatrix.cameraRollRange[0]}
                                max={Animatrix.cameraRollRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev,
                                        cameraRoll: clamp(
                                            value,
                                            Animatrix.cameraRollRange,
                                        ),
                                    }));
                                    if (!isPlaying) {
                                        map.setRoll(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                                // formatValue={(angle) => `${angle}°`}
                            />
                        </>
                    )}
                </Fieldset>
            )}
        </div>
    );
};

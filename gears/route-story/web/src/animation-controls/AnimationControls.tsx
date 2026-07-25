import { FC } from "react";
import { ToolPanelProps, useMachineWard, useMultipleTranslations } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { ClockInput, Checkbox, Fieldset, ClockSliceInput, IconRotateInput, Slider, ToggleSwitch, Label, Span } from "@web-ui";
import { Animatrix, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import { Icons } from "@ui";
import styles from './animation-controls.module.css';

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    animatrix,
}) => {
    const { chronoLens } = useMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const [animationControls, setAnimationControls] = useSubjectState(animatrix.controls$);
    const [searchQuery] = useSubjectState(animatrix.searchQuery$);

    const [
        generalLabel,
        followCurrentPointLabel,
        autoRotateLabel,
        cameraAngleLabel,
        cameraRollLabel,
        bearingLineLengthInMetersLabel,
        maxBearingDiffPerFrameLabel,
        pitchLabel,
        zoomLabel,
        imagePauseDurationLabel,
        speedMultiplierLabel,
        easeDurationLabel,
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.General },
        { n: animatrix.namespace, t: animatrix.translationKey.FollowCurrentPoint },
        { n: animatrix.namespace, t: animatrix.translationKey.AutoRotate },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraAngle },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraRoll },
        { n: animatrix.namespace, t: animatrix.translationKey.BearingLineLengthInMeters },
        { n: animatrix.namespace, t: animatrix.translationKey.MaxBearingDiffPerFrame },
        { n: animatrix.namespace, t: animatrix.translationKey.Pitch },
        { n: animatrix.namespace, t: animatrix.translationKey.Zoom },
        { n: animatrix.namespace, t: animatrix.translationKey.ImagePauseDuration },
        { n: animatrix.namespace, t: animatrix.translationKey.SpeedMultiplier },
        { n: animatrix.namespace, t: animatrix.translationKey.EaseDuration },
    ]);

    const matchesSearch = (label: string): boolean => {
        if (!searchQuery) {
            return true;
        }
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const showGeneral = matchesSearch(generalLabel)
        || matchesSearch(imagePauseDurationLabel)
        || matchesSearch(speedMultiplierLabel);

    const showFollowCurrentPoint = matchesSearch(followCurrentPointLabel)
        || matchesSearch(zoomLabel)
        || matchesSearch(easeDurationLabel)
        || matchesSearch(cameraAngleLabel)
        || matchesSearch(cameraRollLabel)
        || matchesSearch(pitchLabel)
        || matchesSearch(autoRotateLabel)
        || matchesSearch(bearingLineLengthInMetersLabel)
        || matchesSearch(maxBearingDiffPerFrameLabel);

    const {
        followCurrentPoint,
        autoRotate,
        cameraAngle,
        cameraRoll,
        bearingLineLengthInMeters,
        maxBearingDiffPerFrame,
        pitch,
        zoom,
        displayImageDuration,
        speedMultiplier,
        easeDuration
    } = animationControls;

    return (
        <div className={styles['container']}>
            {showGeneral && (
                <Fieldset label={generalLabel} size="sm" expandable contentClassName={styles['fieldset']}>
                    <Label htmlFor="animation-controls-image-pause-duration" align="right">
                        {imagePauseDurationLabel}
                    </Label>
                    <ClockInput
                        id="animation-controls-image-pause-duration"
                        variant="fill-inverse"
                        value={displayImageDuration / 1000 * 6}
                        formatValue={(angle) => `${Math.round(angle / 6)}s`}
                        min={Animatrix.displayImageDurationRange[0] / 1000 * 6}
                        max={Animatrix.displayImageDurationRange[1] / 1000 * 6}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, displayImageDuration: clamp(value * 1000 / 6, Animatrix.displayImageDurationRange)
                        }))}
                    />
                    <Span tabular>{Math.round(displayImageDuration / 1000)}s</Span>
                    <Label htmlFor="animation-controls-speed-multiplier" align="right">
                        {speedMultiplierLabel}
                    </Label>
                    <Slider
                        id="animation-controls-speed-multiplier"
                        value={speedMultiplier}
                        min={Animatrix.speedMultiplierRange[0]}
                        max={Animatrix.speedMultiplierRange[1]}
                        step={1000}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, speedMultiplier: clamp(value, Animatrix.speedMultiplierRange)
                        }))}
                        size="xs"
                    />
                    <Span tabular>{speedMultiplier}</Span>
                </Fieldset>
            )}
            {showFollowCurrentPoint && (
                <Fieldset
                    label={followCurrentPointLabel}
                    size="sm"
                    append={
                        <ToggleSwitch
                            id="animation-controls-follow-current-point"
                            aria-label={followCurrentPointLabel}
                            checked={followCurrentPoint}
                            onChange={() => setAnimationControls((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
                            size="sm"
                        />
                    }
                    expandable
                    contentClassName={styles['fieldset']}
                >
                    <div className={styles["section"]}>
                        {matchesSearch(zoomLabel) && (
                            <Slider
                                id="animation-controls-zoom"
                                label={zoomLabel}
                                value={zoom}
                                step={0.1}
                                min={Animatrix.zoomRange[0]}
                                max={Animatrix.zoomRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev, zoom: clamp(value, Animatrix.zoomRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setZoom(value);
                                    }
                                }}
                                size="xs"
                                disabled={!followCurrentPoint}
                            />
                        )}
                        {matchesSearch(easeDurationLabel) && (
                            <Slider
                                id="animation-controls-ease-duration"
                                label={easeDurationLabel}
                                value={easeDuration}
                                min={Animatrix.easeDurationRange[0]}
                                max={Animatrix.easeDurationRange[1]}
                                step={100}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, easeDuration: clamp(value, Animatrix.easeDurationRange)
                                }))}
                                size="xs"
                                disabled={!followCurrentPoint}
                            />
                        )}
                        {matchesSearch(cameraAngleLabel) && (
                            <IconRotateInput
                                id="animation-controls-camera-angle"
                                valueAdjustment={-90}
                                icon={Icons.NounProject.CameraVideoSide}
                                label={cameraAngleLabel}
                                size='sm'
                                value={cameraAngle}
                                min={Animatrix.cameraAngleRange[0]}
                                max={Animatrix.cameraAngleRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, cameraAngle: clamp(value, Animatrix.cameraAngleRange)
                                }))}
                                disabled={!followCurrentPoint}
                            />
                        )}
                        {matchesSearch(cameraRollLabel) && (
                            <IconRotateInput
                                id="animation-controls-camera-roll"
                                label={cameraRollLabel}
                                icon={Icons.NounProject.CameraVideoFront}
                                size='sm'
                                value={cameraRoll}
                                min={Animatrix.cameraRollRange[0]}
                                max={Animatrix.cameraRollRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev, cameraRoll: clamp(value, Animatrix.cameraRollRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setRoll(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                            />
                        )}
                        {matchesSearch(pitchLabel) && (
                            <ClockSliceInput
                                id="animation-controls-pitch"
                                label={pitchLabel}
                                thumbIcon={Icons.NounProject.CameraVideoSide}
                                size='xs'
                                value={pitch}
                                min={Animatrix.pitchRange[0]}
                                max={Animatrix.pitchRange[1]}
                                onChange={(value) => {
                                    setAnimationControls((prev) => ({
                                        ...prev, pitch: clamp(value, Animatrix.pitchRange)
                                    }));
                                    if (!isPlaying) {
                                        map.setPitch(value);
                                    }
                                }}
                                disabled={!followCurrentPoint}
                            />
                        )}
                        {matchesSearch(autoRotateLabel) && (
                            <Checkbox
                                id="animation-controls-auto-rotate"
                                checked={autoRotate}
                                size="sm"
                                onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                                disabled={!followCurrentPoint}
                            >
                                {autoRotateLabel}
                            </Checkbox>
                        )}
                        {matchesSearch(bearingLineLengthInMetersLabel) && (
                            <Slider
                                id="animation-controls-bearing-line-length-in-meters"
                                label={bearingLineLengthInMetersLabel}
                                value={bearingLineLengthInMeters}
                                step={100}
                                min={Animatrix.bearingLineLengthInMetersRange[0]}
                                max={Animatrix.bearingLineLengthInMetersRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, bearingLineLengthInMeters: clamp(value, Animatrix.bearingLineLengthInMetersRange)
                                }))}
                                size="xs"
                                disabled={!followCurrentPoint || !autoRotate}
                            />
                        )}
                        {matchesSearch(maxBearingDiffPerFrameLabel) && (
                            <ClockInput
                                id="animation-controls-max-bearing-diff-per-frame"
                                label={maxBearingDiffPerFrameLabel}
                                size='xs'
                                value={maxBearingDiffPerFrame}
                                min={Animatrix.maxBearingDiffPerFrameRange[0]}
                                max={Animatrix.maxBearingDiffPerFrameRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, maxBearingDiffPerFrame: clamp(value, Animatrix.maxBearingDiffPerFrameRange)
                                }))}
                                disabled={!followCurrentPoint}
                            />
                        )}
                    </div>
                </Fieldset>
            )}
        </div>
    );
};

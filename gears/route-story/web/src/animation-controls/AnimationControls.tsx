import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import classNames from "classnames";
import { ToolPanelProps, useMachineWard, useMultipleTranslations } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { ClockInput, Checkbox, Fieldset, ClockSliceInput, IconRotateInput, Slider, ToggleSwitch, Label, Span } from "@web-ui";
import { Animatrix } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { WebRouteStoryProps } from "../model";
import styles from './animation-controls.module.css';

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map> & WebRouteStoryProps> = ({
    map,
    animatrix,
    placement,
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
        <div className={classNames(styles['container'], styles[placement])}>
            {showGeneral && (
                <Fieldset label={generalLabel} expandable contentClassName={styles['fieldset']}>
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
                    contentClassName={classNames(styles['fieldset'], styles['top-padding'])}
                >
                    {matchesSearch(zoomLabel) && (
                        <>
                            <Label htmlFor="animation-controls-zoom" align="right">
                                {zoomLabel}
                            </Label>
                            <Slider
                                id="animation-controls-zoom"
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
                            <Span tabular>{zoom.toFixed(1)}</Span>
                        </>
                    )}
                    {matchesSearch(easeDurationLabel) && (
                        <>
                            <Label htmlFor="animation-controls-ease-duration" align="right">
                                {easeDurationLabel}
                            </Label>
                            <Slider
                                id="animation-controls-ease-duration"
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
                            <Span tabular>{easeDuration}ms</Span>
                        </>
                    )}
                    {matchesSearch(autoRotateLabel) && (
                        <>
                            <span />
                            <Checkbox
                                id="animation-controls-auto-rotate"
                                checked={autoRotate}
                                size="sm"
                                onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                                disabled={!followCurrentPoint}
                            >
                                {autoRotateLabel}
                            </Checkbox>
                            <span />
                        </>
                    )}
                    {matchesSearch(cameraAngleLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-angle" align="right">
                                {cameraAngleLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-angle"
                                valueAdjustment={-90}
                                icon={Icons.NounProject.CameraVideoSide}
                                size='sm'
                                value={cameraAngle}
                                min={Animatrix.cameraAngleRange[0]}
                                max={Animatrix.cameraAngleRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, cameraAngle: clamp(value, Animatrix.cameraAngleRange)
                                }))}
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{cameraAngle}°</Span>
                        </>
                    )}
                    {matchesSearch(pitchLabel) && (
                        <>
                            <Label htmlFor="animation-controls-pitch" align="right">
                                {pitchLabel}
                            </Label>
                            <ClockSliceInput
                                id="animation-controls-pitch"
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
                            <Span tabular>{pitch}°</Span>
                        </>
                    )}
                    {matchesSearch(cameraRollLabel) && (
                        <>
                            <Label htmlFor="animation-controls-camera-roll" align="right">
                                {cameraRollLabel}
                            </Label>
                            <IconRotateInput
                                id="animation-controls-camera-roll"
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
                            <Span tabular>{cameraRoll}°</Span>
                        </>
                    )}
                    {matchesSearch(bearingLineLengthInMetersLabel) && (
                        <>
                            <Label htmlFor="animation-controls-bearing-line-length-in-meters" align="right">
                                {bearingLineLengthInMetersLabel}
                            </Label>
                            <Slider
                                id="animation-controls-bearing-line-length-in-meters"
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
                            <Span tabular>{bearingLineLengthInMeters}m</Span>
                        </>
                    )}
                    {matchesSearch(maxBearingDiffPerFrameLabel) && (
                        <>
                            <Label htmlFor="animation-controls-max-bearing-diff-per-frame" align="right">
                                {maxBearingDiffPerFrameLabel}
                            </Label>
                            <ClockInput
                                id="animation-controls-max-bearing-diff-per-frame"
                                size='xs'
                                value={maxBearingDiffPerFrame}
                                min={Animatrix.maxBearingDiffPerFrameRange[0]}
                                max={Animatrix.maxBearingDiffPerFrameRange[1]}
                                onChange={(value) => setAnimationControls((prev) => ({
                                    ...prev, maxBearingDiffPerFrame: clamp(value, Animatrix.maxBearingDiffPerFrameRange)
                                }))}
                                disabled={!followCurrentPoint}
                            />
                            <Span tabular>{maxBearingDiffPerFrame}°</Span>
                        </>
                    )}
                </Fieldset>
            )}
        </div>
    );
};

import { FC } from "react";
import { ToolPanelProps, useMachineWard } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { ClockInput, Checkbox, Fieldset, ClockSliceInput, IconRotateInput, Slider, ToggleSwitch } from "@web-ui";
import { Animatrix, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import { Icons } from "@ui";
import styles from './animation-controls.module.css';

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({
    map,
    animatrix,
}) => {
    const { translatron, individuator, chronoLens } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);
    const t = (key: string) => translatron.translate(settings.language, registry, { n: animatrix.namespace, t: key });
    const [animationControls, setAnimationControls] = useSubjectState(animatrix.controls$);
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
            <Fieldset label={t(animatrix.translationKey.AnimatrixControls)}>
                <div className={styles["section"]}>
                    <ClockInput
                        id="animation-controls-image-pause-duration"
                        label={t(animatrix.translationKey.ImagePauseDuration)}
                        value={displayImageDuration / 1000 * 6}
                        formatValue={(angle) => `${Math.round(angle / 6)}s`}
                        min={Animatrix.displayImageDurationRange[0] / 1000 * 6}
                        max={Animatrix.displayImageDurationRange[1] / 1000 * 6}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, displayImageDuration: clamp(value * 1000 / 6, Animatrix.displayImageDurationRange)
                        }))}
                    />
                    <Slider
                        id="animation-controls-speed-multiplier"
                        label={t(animatrix.translationKey.SpeedMultiplier)}
                        value={speedMultiplier}
                        min={Animatrix.speedMultiplierRange[0]}
                        max={Animatrix.speedMultiplierRange[1]}
                        step={1000}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, speedMultiplier: clamp(value, Animatrix.speedMultiplierRange)
                        }))}
                        size="xs"
                    />
                </div>
                <ToggleSwitch
                    id="animation-controls-follow-current-point"
                    checked={followCurrentPoint}
                    onChange={() => setAnimationControls((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
                    size="sm"
                    label={t(animatrix.translationKey.FollowCurrentPoint)}
                    aria-label={t(animatrix.translationKey.FollowCurrentPoint)}
                />
                {followCurrentPoint ? (
                    <div className={styles["section"]}>
                        <Slider
                            id="animation-controls-zoom"
                            label={t(animatrix.translationKey.Zoom)}
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
                        />
                        <Slider
                            id="animation-controls-ease-duration"
                            label={t(animatrix.translationKey.EaseDuration)}
                            value={easeDuration}
                            min={Animatrix.easeDurationRange[0]}
                            max={Animatrix.easeDurationRange[1]}
                            step={100}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, easeDuration: clamp(value, Animatrix.easeDurationRange)
                            }))}
                            size="xs"
                        />
                        <IconRotateInput
                            id="animation-controls-camera-angle"
                            valueAdjustment={-90}
                            icon={Icons.NounProject.CameraVideoSide}
                            label={t(animatrix.translationKey.CameraAngle)}
                            size='sm'
                            value={cameraAngle}
                            min={Animatrix.cameraAngleRange[0]}
                            max={Animatrix.cameraAngleRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, cameraAngle: clamp(value, Animatrix.cameraAngleRange)
                            }))}
                        />
                        <IconRotateInput
                            id="animation-controls-camera-roll"
                            label={t(animatrix.translationKey.CameraRoll)}
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
                        />
                        <ClockSliceInput
                            id="animation-controls-pitch"
                            label={t(animatrix.translationKey.Pitch)}
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
                        />
                        {/* TODO: Delete this param and leave only autorotate */}
                        <Slider
                            id="animation-controls-bearing-line-length-in-meters"
                            label={<Checkbox
                                id="animation-controls-auto-rotate"
                                checked={autoRotate}
                                size="sm"
                                onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                            >
                                {t(animatrix.translationKey.AutoRotate)} {autoRotate
                                    ? `/ ${t(animatrix.translationKey.BearingLineLengthInMeters)}`
                                    : null}
                            </Checkbox>}
                            value={bearingLineLengthInMeters}
                            step={100}
                            min={Animatrix.bearingLineLengthInMetersRange[0]}
                            max={Animatrix.bearingLineLengthInMetersRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, bearingLineLengthInMeters: clamp(value, Animatrix.bearingLineLengthInMetersRange)
                            }))}
                            size="xs"
                            disabled={!autoRotate}
                        />
                        {/* TODO: Delete this param */}
                        <ClockInput
                            id="animation-controls-max-bearing-diff-per-frame"
                            label={t(animatrix.translationKey.MaxBearingDiffPerFrame)}
                            size='xs'
                            value={maxBearingDiffPerFrame}
                            min={Animatrix.maxBearingDiffPerFrameRange[0]}
                            max={Animatrix.maxBearingDiffPerFrameRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, maxBearingDiffPerFrame: clamp(value, Animatrix.maxBearingDiffPerFrameRange)
                            }))}
                            disabled={!followCurrentPoint}
                        />
                    </div>
                ) : null}
            </Fieldset>
        </div>
    );
};

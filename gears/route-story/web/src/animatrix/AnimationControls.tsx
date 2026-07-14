import { FC } from "react";
import { ToolPanelProps, useMachineWard } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { ClockInput, Checkbox, Fieldset, NumberInput, ClockSliceInput, IconRotateInput, Slider } from "@web-ui";
import { Animatrix, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './animation-controls.module.css';
import { Icons } from "@ui";

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
        zoomInToImages,
        displayImageDuration,
        speedMultiplier,
        easeDuration
    } = animationControls;

    return (
        <div className={styles['container']}>
            <Fieldset label={t(animatrix.translationKey.AnimatrixControls)}>
                <Checkbox
                    id="animation-controls-follow-current-point"
                    checked={followCurrentPoint}
                    onChange={() => setAnimationControls((prev) => ({ ...prev, followCurrentPoint: !prev.followCurrentPoint }))}
                    size="xs"
                >
                    {t(animatrix.translationKey.FollowCurrentPoint)}
                </Checkbox>
                <div className={styles["section"]}>
                    <Checkbox
                        id="animation-controls-auto-rotate"
                        checked={autoRotate}
                        size="xs"
                        onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                        className={styles["top-margin"]}
                    >
                        {t(animatrix.translationKey.AutoRotate)}
                    </Checkbox>
                    {/* TODO: Delete this param */}
                    <Slider
                        id="animation-controls-bearing-line-length-in-meters"
                        label={t(animatrix.translationKey.BearingLineLengthInMeters)}
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
                    <ClockInput
                        id="animation-controls-camera-roll"
                        label={t(animatrix.translationKey.CameraRoll)}
                        size='xs'
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
                    <div />
                    <Checkbox
                        id="animation-controls-zoom-in-to-images"
                        checked={zoomInToImages !== false}
                        onChange={() => setAnimationControls((prev) => ({
                            ...prev,
                            zoomInToImages: prev.zoomInToImages === false ? Animatrix.defaultZoomInToImages : false
                        }))}
                        size="xs"
                        className={styles["top-margin"]}
                    >
                        {t(animatrix.translationKey.ZoomInToImages)}
                    </Checkbox>
                    <NumberInput
                        id="animation-controls-zoom-in-to-images-value"
                        label={t(animatrix.translationKey.ZoomInToImages)}
                        value={zoomInToImages || zoom}
                        min={Animatrix.zoomRange[0]}
                        max={Animatrix.zoomRange[1]}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, zoomInToImages: clamp(value, Animatrix.zoomRange)
                        }))}
                        disabled={zoomInToImages === false}
                    />
                    <NumberInput
                        id="animation-controls-image-pause-duration"
                        label={t(animatrix.translationKey.ImagePauseDuration)}
                        value={displayImageDuration}
                        min={Animatrix.displayImageDurationRange[0]}
                        max={Animatrix.displayImageDurationRange[1]}
                        step={500}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, displayImageDuration: clamp(value, Animatrix.displayImageDurationRange)
                        }))}
                    />
                    <NumberInput
                        id="animation-controls-speed-multiplier"
                        label={t(animatrix.translationKey.SpeedMultiplier)}
                        value={speedMultiplier}
                        min={Animatrix.speedMultiplierRange[0]}
                        max={Animatrix.speedMultiplierRange[1]}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, speedMultiplier: clamp(value, Animatrix.speedMultiplierRange)
                        }))}
                    />
                    <NumberInput
                        id="animation-controls-ease-duration"
                        label={t(animatrix.translationKey.EaseDuration)}
                        value={easeDuration}
                        min={Animatrix.easeDurationRange[0]}
                        max={Animatrix.easeDurationRange[1]}
                        onChange={(value) => setAnimationControls((prev) => ({
                            ...prev, easeDuration: clamp(value, Animatrix.easeDurationRange)
                        }))}
                    />
                </div>
            </Fieldset>
        </div>
    );
};

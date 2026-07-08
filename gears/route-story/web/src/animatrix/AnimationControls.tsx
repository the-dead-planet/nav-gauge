import { FC } from "react";
import { ToolPanelProps, useMachineWard } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { AngleInput, Checkbox, Fieldset, NumberInput } from "@web-ui";
import { Animatrix, RouteStoryProps } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { WebMarkerImageData } from "../images/image-parser";
import styles from './animation-controls.module.css';

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map> & RouteStoryProps<maplibregl.Map, File, WebMarkerImageData>> = ({ 
    animatrix
}) => {
    const { translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
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
                >
                    {t(animatrix.translationKey.FollowCurrentPoint)}
                </Checkbox>
                {followCurrentPoint ? (
                    <div className={styles["section"]}>
                        <Checkbox
                            id="animation-controls-auto-rotate"
                            checked={autoRotate}
                            onChange={() => setAnimationControls((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))}
                            className={styles["top-margin"]}
                        >
                            {t(animatrix.translationKey.AutoRotate)}
                        </Checkbox>
                        <div />
                        <AngleInput
                            id="animation-controls-camera-angle"
                            label={t(animatrix.translationKey.CameraAngle)}
                            size='xs'
                            value={cameraAngle}
                            min={0}
                            max={360}
                            step={6}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, cameraAngle: clamp(value, Animatrix.cameraAngleRange)
                            }))}
                        />
                        <NumberInput
                            id="animation-controls-camera-roll"
                            label={t(animatrix.translationKey.CameraRoll)}
                            value={cameraRoll}
                            min={Animatrix.cameraRollRange[0]}
                            max={Animatrix.cameraRollRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, cameraRoll: clamp(value, Animatrix.cameraRollRange)
                            }))}
                        />
                        <NumberInput
                            id="animation-controls-bearing-line-length-in-meters"
                            label={t(animatrix.translationKey.BearingLineLengthInMeters)}
                            value={bearingLineLengthInMeters}
                            min={Animatrix.bearingLineLengthInMetersRange[0]}
                            max={Animatrix.bearingLineLengthInMetersRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, bearingLineLengthInMeters: clamp(value, Animatrix.bearingLineLengthInMetersRange)
                            }))}
                        />
                        <NumberInput
                            id="animation-controls-max-bearing-diff-per-frame"
                            label={t(animatrix.translationKey.MaxBearingDiffPerFrame)}
                            value={maxBearingDiffPerFrame}
                            min={Animatrix.maxBearingDiffPerFrameRange[0]}
                            max={Animatrix.maxBearingDiffPerFrameRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, maxBearingDiffPerFrame: clamp(value, Animatrix.maxBearingDiffPerFrameRange)
                            }))}
                        />
                        <NumberInput
                            id="animation-controls-pitch"
                            label={t(animatrix.translationKey.Pitch)}
                            value={pitch}
                            min={Animatrix.pitchRange[0]}
                            max={Animatrix.pitchRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, pitch: clamp(value, Animatrix.pitchRange)
                            }))}
                        />
                        <NumberInput
                            id="animation-controls-zoom"
                            label={t(animatrix.translationKey.Zoom)}
                            value={zoom}
                            min={Animatrix.zoomRange[0]}
                            max={Animatrix.zoomRange[1]}
                            onChange={(value) => setAnimationControls((prev) => ({
                                ...prev, zoom: clamp(value, Animatrix.zoomRange)
                            }))}
                        />
                        <Checkbox
                            id="animation-controls-zoom-in-to-images"
                            checked={zoomInToImages !== false}
                            onChange={() => setAnimationControls((prev) => ({
                                ...prev,
                                zoomInToImages: prev.zoomInToImages === false ? Animatrix.defaultZoomInToImages : false
                            }))}
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
                ) : null}
            </Fieldset>
        </div>
    );
};

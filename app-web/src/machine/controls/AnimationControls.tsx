import { FC } from "react";
import { Animatrix, ToolPanelProps, useMachineWard } from "@apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import { Checkbox, Fieldset, Input } from "@web-ui";
import styles from './controls.module.css';

export const AnimationControls: FC<ToolPanelProps<maplibregl.Map>> = () => {
    const { animatrix, translatron, individuator } = useMachineWard();
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
                        <Input
                            id="animation-controls-camera-angle"
                            name="animation-controls-camera-angle"
                            label={t(animatrix.translationKey.CameraAngle)}
                            type='number'
                            value={cameraAngle}
                            min={Animatrix.cameraAngleRange[0]}
                            max={Animatrix.cameraAngleRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, cameraAngle: clamp(Number(event.target.value), Animatrix.cameraAngleRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-camera-roll"
                            name="animation-controls-camera-roll"
                            label={t(animatrix.translationKey.CameraRoll)}
                            type='number'
                            value={cameraRoll}
                            min={Animatrix.cameraRollRange[0]}
                            max={Animatrix.cameraRollRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, cameraRoll: clamp(Number(event.target.value), Animatrix.cameraRollRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-bearing-line-length-in-meters"
                            name="animation-controls-bearing-line-length-in-meters"
                            label={t(animatrix.translationKey.BearingLineLengthInMeters)}
                            type='number'
                            value={bearingLineLengthInMeters}
                            min={Animatrix.bearingLineLengthInMetersRange[0]}
                            max={Animatrix.bearingLineLengthInMetersRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, bearingLineLengthInMeters: clamp(Number(event.target.value), Animatrix.bearingLineLengthInMetersRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-max-bearing-diff-per-frame"
                            name="animation-controls-max-bearing-diff-per-frame"
                            label={t(animatrix.translationKey.MaxBearingDiffPerFrame)}
                            type='number'
                            value={maxBearingDiffPerFrame}
                            min={Animatrix.maxBearingDiffPerFrameRange[0]}
                            max={Animatrix.maxBearingDiffPerFrameRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, maxBearingDiffPerFrame: clamp(Number(event.target.value), Animatrix.maxBearingDiffPerFrameRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-pitch"
                            name="animation-controls-pitch"
                            label={t(animatrix.translationKey.Pitch)}
                            type='number'
                            value={pitch}
                            min={Animatrix.pitchRange[0]}
                            max={Animatrix.pitchRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, pitch: clamp(Number(event.target.value), Animatrix.pitchRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-zoom"
                            name="animation-controls-zoom"
                            label={t(animatrix.translationKey.Zoom)}
                            type='number'
                            value={zoom}
                            min={Animatrix.zoomRange[0]}
                            max={Animatrix.zoomRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, zoom: clamp(Number(event.target.value), Animatrix.zoomRange) }
                                : prev)}
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
                        <Input
                            id="animation-controls-zoom-in-to-images-value"
                            name="animation-controls-zoom-in-to-images-value"
                            label={t(animatrix.translationKey.ZoomInToImages)}
                            type='number'
                            value={zoomInToImages || zoom}
                            min={Animatrix.zoomRange[0]}
                            max={Animatrix.zoomRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, zoomInToImages: clamp(Number(event.target.value), Animatrix.zoomRange) }
                                : prev)}
                            disabled={zoomInToImages === false}
                        />
                        <Input
                            id="animation-controls-image-pause-duration"
                            name="animation-controls-image-pause-duration"
                            label={t(animatrix.translationKey.ImagePauseDuration)}
                            type='number'
                            value={displayImageDuration}
                            min={Animatrix.displayImageDurationRange[0]}
                            max={Animatrix.displayImageDurationRange[1]}
                            step={500}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, displayImageDuration: clamp(Number(event.target.value), Animatrix.displayImageDurationRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-speed-multiplier"
                            name="animation-controls-speed-multiplier"
                            label={t(animatrix.translationKey.SpeedMultiplier)}
                            type='number'
                            value={speedMultiplier}
                            min={Animatrix.speedMultiplierRange[0]}
                            max={Animatrix.speedMultiplierRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, speedMultiplier: clamp(Number(event.target.value), Animatrix.speedMultiplierRange) }
                                : prev)}
                        />
                        <Input
                            id="animation-controls-ease-duration"
                            name="animation-controls-ease-duration"
                            label={t(animatrix.translationKey.EaseDuration)}
                            type='number'
                            value={easeDuration}
                            min={Animatrix.easeDurationRange[0]}
                            max={Animatrix.easeDurationRange[1]}
                            onChange={(event) => setAnimationControls((prev) => !isNaN(Number(event.target.value))
                                ? { ...prev, easeDuration: clamp(Number(event.target.value), Animatrix.easeDurationRange) }
                                : prev)}
                        />
                    </div>
                ) : null}
            </Fieldset>
        </div>
    );
};

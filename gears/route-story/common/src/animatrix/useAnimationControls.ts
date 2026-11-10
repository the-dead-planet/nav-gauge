import { BehaviorSubject } from "rxjs";
import { MarkerImage, useMultipleTranslations, useTranslate } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { millisecondsToDurationParts } from "@ui";
import { Animatrix } from "./animatrix";

export const formatAnimationDuration = (milliseconds: number): string => {
    const { minutes, seconds } = millisecondsToDurationParts(milliseconds);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const pad = (value: number) => String(value).padStart(2, "0");
    if (hours > 0) {
        return `${pad(hours)}:${pad(remainingMinutes)}:${pad(seconds)}`;
    }
    if (remainingMinutes > 0) {
        return `${pad(remainingMinutes)}:${pad(seconds)}`;
    }
    return String(seconds);
};

export const useAnimationControls = <TImageData>(
    animatrix: Animatrix,
    images$: BehaviorSubject<MarkerImage<TImageData>[]>,
) => {
    const [animationControls, setAnimationControls] = useSubjectState(
        animatrix.controls$,
    );
    const [searchQuery] = useSubjectState(animatrix.searchQuery$);
    const [images] = useSubjectState(images$);
    const translate = useTranslate();
    const [
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
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.General },
        {
            n: animatrix.namespace,
            t: animatrix.translationKey.FollowCurrentPoint,
        },
        { n: animatrix.namespace, t: animatrix.translationKey.AutoRotate },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraAngle },
        { n: animatrix.namespace, t: animatrix.translationKey.CameraRoll },
        { n: animatrix.namespace, t: animatrix.translationKey.Pitch },
        { n: animatrix.namespace, t: animatrix.translationKey.Zoom },
        {
            n: animatrix.namespace,
            t: animatrix.translationKey.ImagePauseDuration,
        },
        {
            n: animatrix.namespace,
            t: animatrix.translationKey.RoutePlaybackDuration,
        },
        { n: animatrix.namespace, t: animatrix.translationKey.PlaybackPacing },
        {
            n: animatrix.namespace,
            t: animatrix.translationKey.TotalRecordingDuration,
        },
        { n: animatrix.namespace, t: animatrix.translationKey.EaseDuration },
        {
            n: animatrix.namespace,
            t: animatrix.translationKey.PanToWholeRouteAtEnd,
        },
    ]);
    const playbackPacingOptions = Animatrix.playbackPacingOptions.map(
        ({ value, translationKey }) => ({
            value,
            label: translate({ n: animatrix.namespace, t: translationKey }),
        }),
    );
    const matchesSearch = (label: string): boolean =>
        label.toLowerCase().includes(searchQuery.toLowerCase());
    const showGeneral = [
        generalLabel,
        imagePauseDurationLabel,
        routePlaybackDurationLabel,
        playbackPacingLabel,
        totalRecordingDurationLabel,
        panToWholeRouteAtEndLabel,
        ...playbackPacingOptions.map(({ label }) => label),
    ].some(matchesSearch);
    const showFollowCurrentPoint = [
        followCurrentPointLabel,
        zoomLabel,
        easeDurationLabel,
        cameraAngleLabel,
        cameraRollLabel,
        pitchLabel,
        autoRotateLabel,
    ].some(matchesSearch);
    const displayedImageCount = images.filter(
        (image) => image.distanceFraction !== undefined,
    ).length;
    const totalRecordingDuration =
        animationControls.routePlaybackDuration +
        displayedImageCount * animationControls.displayImageDuration;

    return {
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
    };
};

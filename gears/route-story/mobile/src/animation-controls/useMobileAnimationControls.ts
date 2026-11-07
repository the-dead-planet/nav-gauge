import { glitchmitter } from "@apparatus";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { clamp, useSubjectState } from "@tinker-chest";
import {
    Animatrix,
    useAnimationControls,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { MobileRouteStoryProps } from "../model";

export const useMobileAnimationControls = (
    animatrix: Animatrix,
    images$: MobileRouteStoryProps["images$"],
    map: Pick<MobileMap, "camera$">,
) => {
    const controls = useAnimationControls(animatrix, images$);
    const { chronoLens } = useMobileMachineWard();
    const [isPlaying] = useSubjectState(chronoLens.isPlaying$);

    const changeZoom = (value: number) => {
        const cameraZoom = clamp(value, Animatrix.zoomRange);
        controls.setAnimationControls((previous) => ({
            ...previous,
            cameraZoom,
        }));
        if (!isPlaying) {
            map.camera$.value?.zoomTo(cameraZoom, { duration: 0 });
        }
    };
    const changePitch = (value: number) => {
        const cameraTilt = clamp(value, Animatrix.cameraTiltRange);
        controls.setAnimationControls((previous) => ({
            ...previous,
            cameraTilt,
        }));
        if (!isPlaying) {
            map.camera$.value
                ?.setStop({ pitch: cameraTilt, duration: 0 })
                .catch((error: unknown) => {
                    glitchmitter.transmit("Cannot preview camera pitch", error);
                });
        }
    };

    return { ...controls, changeZoom, changePitch };
};

import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useMultipleTranslations } from "@apparatus";
import { Animatrix, RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Menu } from "@web-ui";
import { Icons } from "@ui";
import { AnimationControls } from "./player-configuration/AnimationControls";
import { LayersControls } from "./player-configuration/LayersControls";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    map: maplibregl.Map;
    animatrix: Animatrix;
    state$: BehaviorSubject<RouteStoryState>;
}

export const ConfigurationButtons: FC<Props> = ({
    gearId,
    translationKey,
    map,
    animatrix,
    state$,
}) => {
    const [
        animatrixControlsLabel,
        layerConfigurationLabel,
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.AnimatrixControls },
        { n: gearId, t: translationKey.LayerConfiguration },
    ]);

    return (
        <>
            <Menu
                icon={Icons.NounProject.Animation}
                iconSize="md"
                aria-label={animatrixControlsLabel}
                tooltip={animatrixControlsLabel}
                tooltipPlacement="top"
                placement="top-right"
            >
                <AnimationControls map={map} animatrix={animatrix} />
            </Menu>
            <Menu
                icon={Icons.NounProject.Paint}
                iconSize="md"
                aria-label={layerConfigurationLabel}
                tooltip={layerConfigurationLabel}
                tooltipPlacement="top"
                placement="top-right"
            >
                <LayersControls gearId={gearId} translationKey={translationKey} state$={state$} />
            </Menu>
        </>
    );
};

import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useMultipleTranslations } from "@apparatus";
import { RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Menu } from "@mobile-ui";
import { Icons } from "@ui";
import { LayersControls } from "./player-configuration/LayersControls";

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    state$: BehaviorSubject<RouteStoryState>;
}

export const ConfigurationButtons: FC<Props> = ({
    gearId,
    translationKey,
    state$,
}) => {
    const [layerConfigurationLabel] = useMultipleTranslations([
        { n: gearId, t: translationKey.LayerConfiguration },
    ]);

    return (
        <>
            <Menu
                icon={Icons.NounProject.Paint as unknown as string}
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

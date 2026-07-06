import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useMultipleTranslations } from "@apparatus";
import { Animatrix, RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Button, Checkbox, Menu } from "@web-ui";
import { Icons } from "@ui";
import { useSubjectState } from "@tinker-chest";
import styles from './configuration-buttons.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    animatrix: Animatrix;
    state$: BehaviorSubject<RouteStoryState>;
}

export const ConfigurationButtons: FC<Props> = ({
    gearId,
    translationKey,
    animatrix,
    state$,
}) => {
    const [state, setState] = useSubjectState(state$);
    const [
        animatrixControlsLabel,
        layerConfigurationLabel,
        linesLabel,
        pointsLabel
    ] = useMultipleTranslations([
        { n: animatrix.namespace, t: animatrix.translationKey.AnimatrixControls },
        { n: gearId, t: translationKey.LayerConfiguration },
        { n: gearId, t: translationKey.Lines },
        { n: gearId, t: translationKey.Points },
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
                <div className={styles['container']}>
                    animatrix
                </div>
            </Menu>
            <Menu
                icon={Icons.NounProject.Paint}
                iconSize="md"
                aria-label={layerConfigurationLabel}
                tooltip={layerConfigurationLabel}
                tooltipPlacement="top"
                placement="top-right"
            >
                <div className={styles['container']}>
                    <Checkbox role="menuitem" size="xs" checked={state.showRouteLine} onChange={(checked) => setState((prev) => ({ ...prev, showRouteLine: checked }))}>
                        {linesLabel}
                    </Checkbox>
                    <Checkbox role="menuitem" size="xs" checked={state.showRoutePoints} onChange={(checked) => setState((prev) => ({ ...prev, showRoutePoints: checked }))}>
                        {pointsLabel}
                    </Checkbox>
                </div>
            </Menu>
        </>
    );
};

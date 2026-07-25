import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useMultipleTranslations } from "@apparatus";
import { RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Fieldset } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import styles from './layers-controls.module.css';

interface Props {
    gearId: string;
    translationKey: typeof RouteStoryTranslationKey;
    state$: BehaviorSubject<RouteStoryState>;
}

export const LayersControls: FC<Props> = ({
    gearId,
    translationKey,
    state$,
}) => {
    const [state, setState] = useSubjectState(state$);
    const [
        layerConfigurationLabel,
        linesLabel,
        pointsLabel
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.LayerConfiguration },
        { n: gearId, t: translationKey.Lines },
        { n: gearId, t: translationKey.Points },
    ]);

    return (
        <div className={styles['container']}>
            <Fieldset size="xs" label={layerConfigurationLabel}>
                <Checkbox role="menuitem" size="xs" checked={state.showRouteLine} onChange={(checked) => setState((prev) => ({ ...prev, showRouteLine: checked }))}>
                    {linesLabel}
                </Checkbox>
                <Checkbox role="menuitem" size="xs" checked={state.showRoutePoints} onChange={(checked) => setState((prev) => ({ ...prev, showRoutePoints: checked }))}>
                    {pointsLabel}
                </Checkbox>
            </Fieldset>
        </div>
    );
};

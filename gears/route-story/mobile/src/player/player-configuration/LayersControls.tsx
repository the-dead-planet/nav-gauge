import { FC } from "react";
import { BehaviorSubject } from "rxjs";
import { useMultipleTranslations } from "@apparatus";
import { RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Fieldset } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";

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
        <Fieldset size="xs" label={layerConfigurationLabel}>
            <Checkbox size="xs" checked={state.showRouteLine} onChange={(checked) => setState((prev) => ({ ...prev, showRouteLine: checked }))}>
                {linesLabel}
            </Checkbox>
            <Checkbox size="xs" checked={state.showRoutePoints} onChange={(checked) => setState((prev) => ({ ...prev, showRoutePoints: checked }))}>
                {pointsLabel}
            </Checkbox>
        </Fieldset>
    );
};

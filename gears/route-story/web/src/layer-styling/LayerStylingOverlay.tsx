import { FC, useState } from "react";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps, useMultipleTranslations } from "@apparatus";
import { getDefaultRouteStoryState, CurrentPointStyle, LayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useTheme } from "@ui";
import { Button, Fieldset, Panel, Popup } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import { WebRouteStoryProps } from "../model";
import { CurrentPointControls } from "../player/player-configuration/CurrentPointControls";
import { LineStyleGroup } from "../player/player-configuration/LineStyleGroup";
import { LineStyleDemo } from "./LayerStyleDemo";
import styles from './layer-styling.module.css';

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);

export const LayerStylingOverlay: FC<OverlayComponentProps<maplibregl.Map> & LayerStylingPopupProps<maplibregl.Map> & WebRouteStoryProps> = ({
    icon,
    onClose,
    gearId,
    translationKey,
    state$,
}) => {
    const theme = useTheme();
    const [active] = useSubjectState(icon.active$);
    const [anchorRef] = useSubjectState(icon.anchorRef$);
    const [state, setState] = useSubjectState(state$);
    const [stylesExpanded, setStylesExpanded] = useState(true);
    const [currentPointExpanded, setCurrentPointExpanded] = useState(false);
    const [
        currentPointLabel,
        activeLabel,
        inactiveLabel,
        linesLabel,
        pointsLabel,
        colorLabel,
        widthLabel,
        outlineColorLabel,
        outlineWidthLabel,
        lineStyleLabel,
        solidLabel,
        dashedLabel,
        lineLabel,
        outlineLabel,
        restoreDefaultsLabel,
        closeLabel,
        dialogLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.CurrentPoint },
        { n: gearId, t: translationKey.Active },
        { n: gearId, t: translationKey.Inactive },
        { n: gearId, t: translationKey.Lines },
        { n: gearId, t: translationKey.Points },
        { n: gearId, t: translationKey.Color },
        { n: gearId, t: translationKey.Width },
        { n: gearId, t: translationKey.OutlineColor },
        { n: gearId, t: translationKey.OutlineWidth },
        { n: gearId, t: translationKey.LineStyle },
        { n: gearId, t: translationKey.Solid },
        { n: gearId, t: translationKey.Dashed },
        { n: gearId, t: translationKey.Line },
        { n: gearId, t: translationKey.Outline },
        { n: gearId, t: translationKey.RestoreDefaults },
        { n: gearId, t: translationKey.Close },
        { n: gearId, t: translationKey.OpenLayerAestheticOptions },
    ]);

    const setActiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleActive: { ...prev.routeStyleActive, ...patch } }));
    const setInactiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleInactive: { ...prev.routeStyleInactive, ...patch } }));
    const setCurrentPoint = (patch: Partial<CurrentPointStyle>) => setState((prev) => ({ ...prev, currentPoint: { ...prev.currentPoint, ...patch } }));

    const toggleCurrentPointExpanded = () => setCurrentPointExpanded((prev) => !prev);

    if (!active || !anchorRef?.current) {
        return null;
    }

    const defaults = getDefaultRouteStoryState(theme);

    return (
        <Popup
            visible
            anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}
            placement="bottom-left"
            dismissOnClickAway={false}
            onClose={onClose}
        >
            <Panel
                variant="fill-inverse"
                className={styles['popup']}
                role="dialog"
                aria-label={dialogLabel}
            >
                <LineStyleDemo
                    state={state}
                    onCurrentPointClick={toggleCurrentPointExpanded}
                    currentPointMenuLabel={currentPointLabel}
                />
                <Fieldset size="xs" label={currentPointLabel} expanded={currentPointExpanded} onExpandedChange={setCurrentPointExpanded}>
                    <CurrentPointControls
                        gearId={gearId}
                        translationKey={translationKey}
                        value={state.currentPoint}
                        onChange={setCurrentPoint}
                    />
                </Fieldset>
                <div className={styles['style-row']}>
                    <LineStyleGroup label={activeLabel} style={state.routeStyleActive}
                        gearId={gearId} translationKey={translationKey}
                        linesLabel={linesLabel} pointsLabel={pointsLabel}
                        colorLabel={colorLabel} widthLabel={widthLabel} outlineColorLabel={outlineColorLabel} outlineWidthLabel={outlineWidthLabel}
                        lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                        expanded={stylesExpanded}
                        onExpandedChange={setStylesExpanded}
                        onChange={setActiveLine}
                    />
                    <LineStyleGroup label={inactiveLabel} style={state.routeStyleInactive}
                        gearId={gearId} translationKey={translationKey}
                        linesLabel={linesLabel} pointsLabel={pointsLabel}
                        colorLabel={colorLabel} widthLabel={widthLabel} outlineColorLabel={outlineColorLabel} outlineWidthLabel={outlineWidthLabel}
                        lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                        expanded={stylesExpanded}
                        onExpandedChange={setStylesExpanded}
                        onChange={setInactiveLine}
                    />
                </div>
                <div className={styles['footer']}>
                    {hasCustomStyling(state, defaults) ? (
                        <Button size="xs" onClick={() => setState(defaults)}>
                            {restoreDefaultsLabel}
                        </Button>
                    ) : null}
                    <Button size="xs" onClick={onClose}>
                        {closeLabel}
                    </Button>
                </div>
            </Panel>
        </Popup>
    );
};
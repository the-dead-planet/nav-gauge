import { FC, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as maplibregl from "maplibre-gl";
import { OverlayComponentProps, useMultipleTranslations } from "@apparatus";
import { getDefaultRouteStoryState, CurrentPointStyle, LayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { getIconAnchorPoint, getMenuPosition, MenuPosition, useTheme } from "@ui";
import { Popup } from "@web-ui";
import { Button } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import { WebRouteStoryProps } from "../model";
import { CurrentPointControls } from "../player/player-configuration/CurrentPointControls";
import { LineStyleGroup } from "../player/player-configuration/LineStyleGroup";
import styles from './layer-styling.module.css';

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);

const LineStyleDemo: FC<{ state: RouteStoryState; onCurrentPointClick: (x: number, y: number) => void; currentPointMenuLabel: string }> = ({ state, onCurrentPointClick, currentPointMenuLabel }) => {
    const { routeStyleActive: active, routeStyleInactive: inactive } = state;
    const activeDash = active.variant === 'dashed' ? '5 4' : undefined;
    const inactiveDash = inactive.variant === 'dashed' ? '5 4' : undefined;
    const activeWidth = Math.max(2, Math.min(active.width, 10));
    const inactiveWidth = Math.max(2, Math.min(inactive.width, 10));
    const activeOutlineWidth = Math.max(2, activeWidth + active.outlineWidth * 2);
    const inactiveOutlineWidth = Math.max(2, inactiveWidth + inactive.outlineWidth * 2);
    const radius = state.currentPoint.size;
    const svgRef = useRef<SVGSVGElement | null>(null);

    const handleCurrentPointClick = () => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        onCurrentPointClick(rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    return (
        <svg
            ref={svgRef}
            className={styles['demo-line']}
            viewBox="0 0 300 20"
            preserveAspectRatio="none"
        >
            <line x1="2" y1="10" x2="150" y2="10" stroke={active.outlineColor} strokeWidth={activeOutlineWidth} strokeDasharray={activeDash} strokeLinecap="round" />
            <line x1="2" y1="10" x2="150" y2="10" stroke={active.color} strokeWidth={activeWidth} strokeDasharray={activeDash} strokeLinecap="round" />
            <line x1="150" y1="10" x2="298" y2="10" stroke={inactive.outlineColor} strokeWidth={inactiveOutlineWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <line x1="150" y1="10" x2="298" y2="10" stroke={inactive.color} strokeWidth={inactiveWidth} strokeDasharray={inactiveDash} strokeLinecap="round" />
            <g
                className={styles['demo-point']}
                role="button"
                tabIndex={0}
                aria-label={currentPointMenuLabel}
                onClick={handleCurrentPointClick}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleCurrentPointClick();
                    }
                }}
            >
                <circle cx="150" cy="10" r={radius + 8} fill="transparent" />
                <circle cx="150" cy="10" r={radius + 2} fill={state.currentPoint.outlineColor} />
                <circle cx="150" cy="10" r={radius} fill={state.currentPoint.fillColor} />
            </g>
        </svg>
    );
};

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
    const [currentPointMenuAnchor, setCurrentPointMenuAnchor] = useState<{ x: number; y: number } | null>(null);
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

    const toggleCurrentPointMenu = (x: number, y: number) => setCurrentPointMenuAnchor((previous) => (previous ? null : { x, y }));

    const anchorRect = anchorRef?.current?.getBoundingClientRect();
    const menuPosition = useMemo<MenuPosition>(() => {
        if (!anchorRect || !active) {
            return {};
        }
        const point = getIconAnchorPoint('top-right', anchorRect.left, anchorRect.top, anchorRect.width, anchorRect.height);

        return getMenuPosition('top-left', point, window.innerWidth, window.innerHeight);
    }, [anchorRef, anchorRect, active]);

    if (!active || !anchorRect) {
        return null;
    }

    const defaults = getDefaultRouteStoryState(theme);
    const isDirty = hasCustomStyling(state, defaults);

    const positionStyle: { top?: number; left?: number; bottom?: number; right?: number } = {};
    if (menuPosition.top !== undefined) positionStyle.top = menuPosition.top;
    if (menuPosition.left !== undefined) positionStyle.left = menuPosition.left;
    if (menuPosition.bottom !== undefined) positionStyle.bottom = menuPosition.bottom;
    if (menuPosition.right !== undefined) positionStyle.right = menuPosition.right;

    return (
        <>
            {createPortal(
                <div
                    className={styles['popup']}
                    style={{
                        ...positionStyle,
                        backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }}
                    role="dialog"
                    aria-label={dialogLabel}
                >
            <LineStyleDemo state={state} onCurrentPointClick={toggleCurrentPointMenu} currentPointMenuLabel={currentPointLabel} />
            <div className={styles['style-row']}>
                <LineStyleGroup label={activeLabel} style={state.routeStyleActive}
                    linesLabel={linesLabel} pointsLabel={pointsLabel}
                    colorLabel={colorLabel} widthLabel={widthLabel} outlineColorLabel={outlineColorLabel} outlineWidthLabel={outlineWidthLabel}
                    lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                    onChange={setActiveLine}
                />
                <LineStyleGroup label={inactiveLabel} style={state.routeStyleInactive}
                    linesLabel={linesLabel} pointsLabel={pointsLabel}
                    colorLabel={colorLabel} widthLabel={widthLabel} outlineColorLabel={outlineColorLabel} outlineWidthLabel={outlineWidthLabel}
                    lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                    onChange={setInactiveLine}
                />
            </div>
            <div className={styles['footer']}>
                {isDirty && (
                    <Button size="xs" onClick={() => setState(defaults)}>
                        {restoreDefaultsLabel}
                    </Button>
                )}
                <Button size="xs" onClick={onClose}>
                    {closeLabel}
                </Button>
            </div>
            {currentPointMenuAnchor && (
                <Popup visible onClose={() => setCurrentPointMenuAnchor(null)} position={currentPointMenuAnchor} placement="top-right" overlayClassName={styles['current-point-menu']}>
                    <div
                        className={styles['popup']}
                        style={{
                            backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                            borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                        }}
                        role="dialog"
                        aria-label={currentPointLabel}
                    >
                        <CurrentPointControls gearId={gearId} translationKey={translationKey} value={state.currentPoint} onChange={setCurrentPoint} />
                        <Button size="xs" onClick={() => setCurrentPointMenuAnchor(null)}>
                            {closeLabel}
                        </Button>
                    </div>
                </Popup>
            )}
                </div>,
                document.body,
            )}
        </>
    );
};
import { FC, useMemo, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { OverlayComponentProps, useMultipleTranslations } from "@apparatus";
import { getIconAnchorPoint, getMenuPosition, MenuPosition, useTheme } from "@ui";
import { getDefaultRouteStoryState, CurrentPointStyle, LayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState, RouteStoryTranslationKey } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { MobileRouteStoryProps } from "../model";
import { Button } from "@mobile-ui";
import { CurrentPointControls } from "../player/player-configuration/CurrentPointControls";
import { LineStyleGroup } from "../player/player-configuration/LineStyleGroup";

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);

const DemoLineSegment: FC<{ color: string; outlineColor: string; width: number; outlineWidth: number; variant: 'solid' | 'dashed' }> = ({ color, outlineColor, width, outlineWidth, variant }) => {
    const lineWidth = Math.max(2, Math.min(width, 10));
    const outlineSize = lineWidth + outlineWidth * 2;

    if (variant === 'dashed') {
        return (
            <View style={{ flex: 1, height: 0, borderTopWidth: outlineSize, borderTopColor: outlineColor, borderStyle: 'dashed', justifyContent: 'center' }}>
                <View style={{ height: 0, borderTopWidth: lineWidth, borderTopColor: color, borderStyle: 'dashed' }} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, height: outlineSize, backgroundColor: outlineColor, justifyContent: 'center' }}>
            <View style={{ height: lineWidth, backgroundColor: color }} />
        </View>
    );
};

const LineStyleDemo: FC<{ state: RouteStoryState; onCurrentPointClick: () => void; currentPointMenuLabel: string }> = ({ state, onCurrentPointClick, currentPointMenuLabel }) => {
    const radius = state.currentPoint.size;

    return (
        <View style={styles['demo-line']} pointerEvents="none">
            <DemoLineSegment
                color={state.routeStyleActive.color}
                outlineColor={state.routeStyleActive.outlineColor}
                width={state.routeStyleActive.width}
                outlineWidth={state.routeStyleActive.outlineWidth}
                variant={state.routeStyleActive.variant}
            />
            <DemoLineSegment
                color={state.routeStyleInactive.color}
                outlineColor={state.routeStyleInactive.outlineColor}
                width={state.routeStyleInactive.width}
                outlineWidth={state.routeStyleInactive.outlineWidth}
                variant={state.routeStyleInactive.variant}
            />
            <Pressable
                style={styles['demo-point']}
                pointerEvents="auto"
                accessibilityRole="button"
                accessibilityLabel={currentPointMenuLabel}
                onPress={onCurrentPointClick}
            >
                <View style={[styles['demo-point-outline'], {
                    width: (radius + 2) * 2,
                    height: (radius + 2) * 2,
                    borderRadius: radius + 2,
                    backgroundColor: state.currentPoint.outlineColor,
                }]} />
                <View style={[styles['demo-point-fill'], {
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: radius,
                    backgroundColor: state.currentPoint.fillColor,
                }]} />
            </Pressable>
        </View>
    );
};

export const LayerStylingOverlay: FC<OverlayComponentProps<MobileMap> & LayerStylingPopupProps<MobileMap> & MobileRouteStoryProps> = ({
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
    const [currentPointMenuOpen, setCurrentPointMenuOpen] = useState(false);
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
    ]);

    const setActiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleActive: { ...prev.routeStyleActive, ...patch } }));
    const setInactiveLine = (patch: Partial<RouteStoryLineStyle>) => setState((prev) => ({ ...prev, routeStyleInactive: { ...prev.routeStyleInactive, ...patch } }));
    const setCurrentPoint = (patch: Partial<CurrentPointStyle>) => setState((prev) => ({ ...prev, currentPoint: { ...prev.currentPoint, ...patch } }));

    const menuPosition = useMemo<MenuPosition>(() => {
        if (!active) {
            return {};
        }
        const anchor = anchorRef?.current;
        if (!anchor) {
            return {};
        }
        const rect = anchor.getBoundingClientRect();
        const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
        const point = getIconAnchorPoint('top-right', rect.left, rect.top, rect.width, rect.height);

        return getMenuPosition('top-left', point, windowWidth, windowHeight);
    }, [active, anchorRef]);

    const defaults = getDefaultRouteStoryState(theme);
    const isDirty = hasCustomStyling(state, defaults);

    return (
        <>
            <Modal visible={!!active} transparent animationType="fade" onRequestClose={onClose}>
                <Pressable style={styles.overlay}>
                    <View
                        style={[
                            styles.popup,
                            {
                                ...menuPosition,
                                backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                                borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                            },
                        ]}
                    >
                        <LineStyleDemo state={state} onCurrentPointClick={() => setCurrentPointMenuOpen(true)} currentPointMenuLabel={currentPointLabel} />
                        <ScrollView contentContainerStyle={styles.content}>
                            <View style={styles['style-row']}>
                                <View style={styles['style-col']}>
                                    <LineStyleGroup label={activeLabel} style={state.routeStyleActive}
                                        linesLabel={linesLabel} pointsLabel={pointsLabel}
                                        lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                                        onChange={setActiveLine} />
                                </View>
                                <View style={styles['style-col']}>
                                    <LineStyleGroup label={inactiveLabel} style={state.routeStyleInactive}
                                        linesLabel={linesLabel} pointsLabel={pointsLabel}
                                        lineStyleLabel={lineStyleLabel} lineLabel={lineLabel} outlineLabel={outlineLabel} solidLabel={solidLabel} dashedLabel={dashedLabel}
                                        onChange={setInactiveLine} />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.footer}>
                            {isDirty && (
                                <Button size="xs" onPress={() => setState(defaults)}>
                                    {restoreDefaultsLabel}
                                </Button>
                            )}
                            <Button size="xs" onPress={onClose}>
                                {closeLabel}
                            </Button>
                        </View>
                    </View>
                </Pressable>
            </Modal>
            <Modal visible={currentPointMenuOpen} transparent animationType="fade" onRequestClose={() => setCurrentPointMenuOpen(false)}>
                <Pressable style={styles.overlay} onPress={() => setCurrentPointMenuOpen(false)}>
                    <Pressable
                        style={[
                            styles.popup,
                            styles['current-point-panel'],
                            {
                                backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                                borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                            },
                        ]}
                        onPress={() => { }}
                    >
                        <CurrentPointControls gearId={gearId} translationKey={translationKey} value={state.currentPoint} onChange={setCurrentPoint} />
                        <View style={styles.footer}>
                            <Button size="xs" onPress={() => setCurrentPointMenuOpen(false)}>
                                {closeLabel}
                            </Button>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        position: 'absolute',
        width: Math.min(300, Dimensions.get('window').width - 16),
        maxHeight: '70%',
        borderWidth: 1,
        padding: 12,
        gap: 10,
    },
    'current-point-panel': {
        position: 'relative',
    },
    'demo-line': {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    'demo-point-outline': {
        position: 'absolute',
    },
    'demo-point-fill': {
        position: 'absolute',
    },
    'style-row': {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-start',
    },
    'style-col': {
        flex: 1,
    },
    content: {
        gap: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
});
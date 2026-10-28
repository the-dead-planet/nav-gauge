import { FC, useEffect, useRef, useState } from "react";
import { BackHandler, HostInstance, ScrollView, StyleSheet, View } from "react-native";
import { ToolPopupProps, useMultipleTranslations } from "@apparatus";
import { useTheme } from "@ui";
import { getDefaultRouteStoryState, CurrentPointStyle, RouteStoryLayerStylingPopupProps, RouteStoryLineStyle, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";
import { MobileRouteStoryProps } from "../model";
import { HudConnector, Popup, Tabstrip } from "@mobile-ui";
import { CurrentPointControls } from "./CurrentPointControls";
import { LineStyleGroup } from "./LineStyleGroup";
import { DemoLine } from "./demo-line/DemoLine";

const styles = StyleSheet.create({
    popup: {
        width: '100%',
        maxWidth: 360,
        maxHeight: '100%',
    },
    'demo-section': {
        paddingTop: 10,
        paddingHorizontal: 10,
        paddingBottom: 4,
    },
    scroll: {
        flexShrink: 1,
    },
    content: {
        paddingTop: 8,
    },
});

const hasCustomStyling = (current: RouteStoryState, defaults: RouteStoryState): boolean =>
    JSON.stringify(current.routeStyleActive) !== JSON.stringify(defaults.routeStyleActive) ||
    JSON.stringify(current.routeStyleInactive) !== JSON.stringify(defaults.routeStyleInactive) ||
    JSON.stringify(current.currentPoint) !== JSON.stringify(defaults.currentPoint);


type Props = ToolPopupProps<MobileMap> &
    RouteStoryLayerStylingPopupProps<MobileMap> &
    MobileRouteStoryProps;

export const LayerStylingPopup: FC<Props> = ({
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
    const [selectedStyle, setSelectedStyle] = useState("active");
    const tabstripRef = useRef<HostInstance>(null);
    const activeRef = useRef<HostInstance>(null);
    const currentPointRef = useRef<HostInstance>(null);
    const inactiveRef = useRef<HostInstance>(null);
    const [
        currentPointLabel,
        activeLabel,
        inactiveLabel,
        restoreDefaultsLabel,
        closeLabel,
        dialogLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.CurrentPoint },
        { n: gearId, t: translationKey.Active },
        { n: gearId, t: translationKey.Inactive },
        { n: gearId, t: translationKey.RestoreDefaults },
        { n: gearId, t: translationKey.Close },
        { n: gearId, t: translationKey.OpenLayerAestheticOptions },
    ]);

    const setActiveLine = (patch: Partial<RouteStoryLineStyle>) =>
        setState((prev) => ({
            ...prev,
            routeStyleActive: { ...prev.routeStyleActive, ...patch },
        }));
    const setInactiveLine = (patch: Partial<RouteStoryLineStyle>) =>
        setState((prev) => ({
            ...prev,
            routeStyleInactive: { ...prev.routeStyleInactive, ...patch },
        }));
    const setCurrentPoint = (patch: Partial<CurrentPointStyle>) =>
        setState((prev) => ({
            ...prev,
            currentPoint: { ...prev.currentPoint, ...patch },
        }));

    useEffect(() => {
        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (active) {
                    onClose();
                    return true;
                }
                return false;
            },
        );
        return () => subscription.remove();
    }, [active, onClose]);

    const defaults = getDefaultRouteStoryState(theme);
    const isDirty = hasCustomStyling(state, defaults);
    const targetRef =
        selectedStyle === "active"
            ? activeRef
            : selectedStyle === "current-point"
                ? currentPointRef
                : inactiveRef;
    const fromAnchor =
        selectedStyle === "active"
            ? "top-left"
            : selectedStyle === "current-point"
                ? "top"
                : "top-right";

    return (
        <Popup
            modal={false}
            visible={active && !!anchorRef?.current}
            anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}
            triggerAnchor="bottom-left"
            popupAnchor="top-left"
            dismissOnClickAway={false}
            onClose={onClose}
            popupStyle={styles.popup}
            variant="fill-translucent"
        >
            <HudConnector
                fromRef={tabstripRef}
                toRef={targetRef}
                fromAnchor={fromAnchor}
                toAnchor="bottom"
                color="secondary"
                activeGlow="glow"
            >
                <View
                    style={styles["demo-section"]}
                    accessibilityLabel={dialogLabel}
                >
                    <DemoLine
                        state={state}
                        onActiveClick={() => setSelectedStyle("active")}
                        onCurrentPointClick={() =>
                            setSelectedStyle("current-point")
                        }
                        onInactiveClick={() => setSelectedStyle("inactive")}
                        activeMenuLabel={activeLabel}
                        currentPointMenuLabel={currentPointLabel}
                        inactiveMenuLabel={inactiveLabel}
                        activeRef={activeRef}
                        currentPointRef={currentPointRef}
                        inactiveRef={inactiveRef}
                    />
                </View>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                >
                    <View ref={tabstripRef}>
                        <Tabstrip
                            variant="fill-inverse"
                            spread
                            value={selectedStyle}
                            onChange={setSelectedStyle}
                            overflowAccessibilityLabel={dialogLabel}
                            actions={{
                                primary: {
                                    label: closeLabel,
                                    onPress: onClose,
                                },
                                secondary: isDirty ? {
                                    label: restoreDefaultsLabel,
                                    onPress: () => setState(defaults),
                                } : undefined,
                            }}
                            options={[
                                { value: "active", label: activeLabel },
                                {
                                    value: "current-point",
                                    label: currentPointLabel,
                                },
                                { value: "inactive", label: inactiveLabel },
                            ]}
                        >
                            {selectedStyle === "current-point" ? (
                                <CurrentPointControls
                                    gearId={gearId}
                                    translationKey={translationKey}
                                    value={state.currentPoint}
                                    onChange={setCurrentPoint}
                                />
                            ) : selectedStyle === "active" ? (
                                <LineStyleGroup
                                    showColorTransition
                                    style={state.routeStyleActive}
                                    gearId={gearId}
                                    translationKey={translationKey}
                                    onChange={setActiveLine}
                                />
                            ) : (
                                <LineStyleGroup
                                    style={state.routeStyleInactive}
                                    gearId={gearId}
                                    translationKey={translationKey}
                                    onChange={setInactiveLine}
                                />
                            )}
                        </Tabstrip>
                    </View>
                </ScrollView>
            </HudConnector>
        </Popup>
    );
};

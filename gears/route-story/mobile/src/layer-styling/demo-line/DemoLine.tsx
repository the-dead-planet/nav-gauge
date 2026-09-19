import { FC, RefObject } from "react";
import { HostInstance, Pressable, StyleSheet, View } from "react-native";
import { requiresSplitLineGeometry, RouteStoryState } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons, parseColor, toCssColor } from "@ui";
import { Icon } from "@mobile-ui";
import { DemoLineSegment } from "./DemoLineSegment";

const styles = StyleSheet.create({
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
        left: '50%',
        width: 40,
        marginLeft: -20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segment: { flex: 1 },
    transition: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    'transition-line': {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    'transition-strip': { flex: 1 },
});

interface Props {
    state: RouteStoryState;
    onCurrentPointClick: () => void;
    onActiveClick: () => void;
    onInactiveClick: () => void;
    activeMenuLabel: string;
    inactiveMenuLabel: string;
    currentPointMenuLabel: string;
    activeRef: RefObject<HostInstance | null>;
    currentPointRef: RefObject<HostInstance | null>;
    inactiveRef: RefObject<HostInstance | null>;
}

const interpolateColor = (from: string, to: string, fraction: number): string => {
    const start = parseColor(from);
    const end = parseColor(to);

    return toCssColor({
        r: Math.round(start.r + (end.r - start.r) * fraction),
        g: Math.round(start.g + (end.g - start.g) * fraction),
        b: Math.round(start.b + (end.b - start.b) * fraction),
        a: start.a + (end.a - start.a) * fraction,
    });
};

export const DemoLine: FC<Props> = ({
    state,
    onCurrentPointClick,
    onActiveClick,
    onInactiveClick,
    activeMenuLabel,
    inactiveMenuLabel,
    currentPointMenuLabel,
    activeRef,
    currentPointRef,
    inactiveRef,
}) => {
    const markerSize = 16 * state.currentPoint.size;
    const markerRotation = state.currentPoint.rotation + (state.currentPoint.autoRotate ? 90 : 0);
    const icon = state.currentPoint.icon === 'Circle' ? Icons.Circle : Icons.NounProject[state.currentPoint.icon];
    const transitionLengthPercent = requiresSplitLineGeometry(state) ? 0 : state.currentPoint.colorTransitionLengthPercent;
    const transitionStrips = Array.from({ length: 24 }, (_, index) => index / 23);
    const active = state.routeStyleActive;
    const inactive = state.routeStyleInactive;
    const activeWidth = Math.min(active.width, 10);
    const inactiveWidth = Math.min(inactive.width, 10);

    return (
        <View style={styles['demo-line']} pointerEvents="box-none">
            <Pressable ref={activeRef} style={styles.segment} accessibilityRole="button" accessibilityLabel={activeMenuLabel} onPress={onActiveClick}><DemoLineSegment {...state.routeStyleActive} /></Pressable>
            <Pressable ref={inactiveRef} style={styles.segment} accessibilityRole="button" accessibilityLabel={inactiveMenuLabel} onPress={onInactiveClick}><DemoLineSegment {...state.routeStyleInactive} /></Pressable>
            {transitionLengthPercent > 0 && active.showRouteLine && inactive.showRouteLine ? (
                <View pointerEvents="none" style={[styles.transition, { left: `${50 - transitionLengthPercent / 2}%`, width: `${transitionLengthPercent}%` }]}>
                    <View style={styles['transition-line']}>
                        {transitionStrips.map((fraction, index) => <View key={index} style={[styles['transition-strip'], {
                            height: fraction <= 0.5 ? activeWidth + active.outlineWidth * 2 : inactiveWidth + inactive.outlineWidth * 2,
                            backgroundColor: interpolateColor(active.outlineColor, inactive.outlineColor, fraction),
                        }]} />)}
                    </View>
                    <View style={styles['transition-line']}>
                        {transitionStrips.map((fraction, index) => <View key={index} style={[styles['transition-strip'], {
                            height: fraction <= 0.5 ? activeWidth : inactiveWidth,
                            backgroundColor: interpolateColor(active.color, inactive.color, fraction),
                        }]} />)}
                    </View>
                </View>
            ) : null}
            <Pressable
                ref={currentPointRef}
                style={styles['demo-point']}
                accessibilityRole="button"
                accessibilityLabel={currentPointMenuLabel}
                onPress={onCurrentPointClick}
            >
                <View style={{ transform: [{ rotate: `${markerRotation}deg` }] }}>
                    <Icon icon={icon} width={markerSize} height={markerSize} color={state.currentPoint.fillColor} />
                </View>
            </Pressable>
        </View>
    );
};

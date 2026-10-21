import { FC, ReactNode, useEffect, useMemo, useRef } from "react";
import { Animated, LayoutChangeEvent, StyleSheet } from "react-native";
import { RecordingView, useViewRecorder } from "react-native-view-recorder";
import { SurveillanceState } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap, useMobileMachineWard } from "@mobile-apparatus";
import { useBlinkingPulse } from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    recordingView: {
        flex: 1,
    },
    onTopBorder: {
        borderWidth: 2,
        zIndex: 2,
    },
});

interface Props {
    map: MobileMap;
    children?: ReactNode;
}

/**
 * Recording chrome wrapper. Owns the view recorder and surveillance wiring, and
 * renders the recording view (which captures whatever is drawn inside it) inside
 * the blinking border container.
 */
export const MapCanvasContainer: FC<Props> = ({
    map,
    children,
}) => {
    const viewRecorderRef = useRef(null);
    const recorder = useViewRecorder();
    const theme = useTheme();
    const { cartomancer, chronoLens, signaliumBureau } = useMobileMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [blinkingState] = useSubjectState(cartomancer.blinkingState$);
    const pulse = useBlinkingPulse();

    const blinkBorderColor = blinkingState
        ? theme.color(blinkingState.color)
        : undefined;

    const borderColor = useMemo(
        () => pulse.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', blinkBorderColor ?? 'transparent'],
        }),
        [pulse, blinkBorderColor],
    );

    useEffect(() => {
        const abortController = new AbortController();
        chronoLens.viewRecorder = recorder;
        chronoLens.setUpSurveillance(signaliumBureau, abortController.signal);

        return () => {
            abortController.abort();
            chronoLens.viewRecorder = null;
            chronoLens.clearSurveillance();
        };
    }, [recorder]);

    const handleLayoutChange = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        map.mapSize$.next({ width, height })
    };

    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFill,
                surveillanceState === SurveillanceState.InProgress
                    ? [styles.onTopBorder, { borderColor }]
                    : undefined,
            ].flat(1)}
        >
            <RecordingView
                ref={viewRecorderRef}
                sessionId={recorder.sessionId}
                style={styles.recordingView}
                onLayout={handleLayoutChange}
            >
                {children}
            </RecordingView>
        </Animated.View>
    );
};

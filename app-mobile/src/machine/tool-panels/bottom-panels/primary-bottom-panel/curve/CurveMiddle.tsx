import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";
import { CURVE_SIZE } from "./tinkers";

const styles = StyleSheet.create({
    curve: {
        borderTopWidth: 2,
        boxSizing: "border-box",
        position: 'absolute',
        left: CURVE_SIZE,
        right: CURVE_SIZE,
        top: 0,
        bottom: 0,
    },
});

export const CurveMiddle: FC = () => {
    const theme = useTheme();

    return (
        <View style={[styles.curve, {
            backgroundColor: theme.componentColor('background', 0.87),
            borderTopColor: theme.color('primary'),
        }]} />
    );
};
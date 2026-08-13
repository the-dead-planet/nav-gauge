import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    curve: {
        borderTopWidth: 2,
        flex: 1,
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
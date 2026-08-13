import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    spacer: {
        flex: 1,
        height: 0,
        borderBottomWidth: 2,
    },
});

export const CurveSpacer: FC = () => {
    const theme = useTheme();

    return (
        <View pointerEvents="none" style={[styles.spacer, { 
            borderBottomColor: theme.color('primary')
        }]} />
    );
};
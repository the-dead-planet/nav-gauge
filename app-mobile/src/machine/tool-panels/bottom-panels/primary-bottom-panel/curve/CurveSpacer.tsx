import { FC } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    spacer: {
        height: 0,
        borderBottomWidth: 2,
    },
});

interface Props {
    style?: { flex: 1 } | { width: DimensionValue };
}

export const CurveSpacer: FC<Props> = ({ style }) => {
    const theme = useTheme();

    return (
        <View
            pointerEvents="none"
            style={[
                styles.spacer,
                { borderBottomColor: theme.color('primary') },
                style,
            ]}
        />
    );
};

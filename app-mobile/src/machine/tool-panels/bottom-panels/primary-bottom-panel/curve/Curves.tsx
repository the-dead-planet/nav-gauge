import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { CurveLeft } from "./CurveLeft";
import { CurveMiddle } from "./CurveMiddle";
import { CurveRight } from "./CurveRight";
import { useTheme } from "@ui";
import { resolveElevationFilter, resolveElevationStyle } from "@mobile-ui";

const styles = StyleSheet.create({
    curves: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
    }
});

export const Curves: FC = () => {
    const theme = useTheme();

    return (
        <View style={[
            styles.curves,
            {
                filter: [{
                    dropShadow: resolveElevationFilter(theme, 'raised', 'up'),
                }],
                ...resolveElevationStyle(theme, 'raised', 'up'),
            },
        ]}>
            <CurveLeft />
            <CurveMiddle />
            <CurveRight />
        </View>
    );
};

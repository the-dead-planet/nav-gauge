import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";
import { Curves } from "./Curves";

const styles = StyleSheet.create({
    curvesContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        height: PANEL_HEADER_CURVE_SIZES.size,
        paddingTop: 4,
        paddingHorizontal: PANEL_HEADER_CURVE_SIZES.size,
        flexShrink: 0,
    },
});

interface Props {
    children?: ReactNode;
}

export const CurvesContainer: FC<Props> = ({ children }) => {
    return (
        <View style={styles.curvesContainer} pointerEvents="box-none">
            <Curves />
            {children}
        </View>
    );
};

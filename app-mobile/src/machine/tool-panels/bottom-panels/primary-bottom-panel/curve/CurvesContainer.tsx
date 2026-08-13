import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { CURVE_SIZE } from "@apparatus";
import { Curves } from "./Curves";

const styles = StyleSheet.create({
    curvesContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        height: CURVE_SIZE,
        paddingTop: 4,
        paddingHorizontal: CURVE_SIZE,
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

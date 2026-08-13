import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { CurveLeft } from "./CurveLeft";
import { CurveMiddle } from "./CurveMiddle";
import { CurveRight } from "./CurveRight";

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
    return (
        <View style={styles.curves}>
            <CurveLeft />
            <CurveMiddle />
            <CurveRight />
        </View>
    );
};

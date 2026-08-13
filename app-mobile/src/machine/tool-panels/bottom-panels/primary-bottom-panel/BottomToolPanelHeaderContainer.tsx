import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { CurveLeft, CurveMiddle, CurveRight, CurveSpacer } from "./curve";
import { CURVE_SIZE } from "./curve/tinkers";

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        transform: [
            { translateY: "-100%" },
        ],
    },
    headerContent: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 4,
        paddingHorizontal: CURVE_SIZE,
    },
});

interface Props {
    sideActions: ReactNode;
    joinHeaderButtons?: boolean;
    joined: boolean;
    bothSidePanels: boolean;
    onlyLeftPanel: boolean;
    onlyRightPanel: boolean;
    children: ReactNode;
}

export const BottomToolPanelHeaderContainer: FC<Props> = ({
    sideActions,
    joinHeaderButtons,
    joined,
    bothSidePanels,
    onlyLeftPanel,
    onlyRightPanel,
    children,
}) => {

    return (
        <View style={styles.header} pointerEvents="box-none">
            <CurveSpacer />

            <View style={styles.headerContent} pointerEvents="box-none">
                <CurveLeft />
                <CurveMiddle />
                <CurveRight />

                {children}
                {joined ? sideActions : null}
            </View>

            {!joined ? (
                <>
                    <CurveSpacer />
                    <View style={styles.headerContent}>
                        <CurveLeft />
                        <CurveMiddle />
                        <CurveRight />

                        {sideActions}
                    </View>
                </>
            ) : null}
            <CurveSpacer />
        </View>
    );
};
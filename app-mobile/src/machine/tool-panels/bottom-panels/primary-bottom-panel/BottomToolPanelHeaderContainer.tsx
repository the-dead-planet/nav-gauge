import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { CurveSpacer } from "./curve";
import { CurvesContainer } from "./curve/CurvesContainer";
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        transform: [
            { translateY: "-100%" },
        ],
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
        <View style={styles.container} pointerEvents="box-none">
            <CurveSpacer
                style={joinHeaderButtons || bothSidePanels || onlyLeftPanel
                    ? { flex: 1 }
                    : { width: PANEL_HEADER_CURVE_SIZES.leftSpacer }}
            />

            <CurvesContainer>
                {children}
                {joined ? sideActions : null}
            </CurvesContainer>

            {!joined ? (
                <>
                    <CurveSpacer style={{ flex: 1 }} />
                    <CurvesContainer>
                        {sideActions}
                    </CurvesContainer>
                </>
            ) : null}
            <CurveSpacer
                style={joinHeaderButtons || bothSidePanels
                    ? { flex: 1 }
                    : {
                        width: onlyRightPanel
                            ? PANEL_HEADER_CURVE_SIZES.onlyLeftPanelRightSpacer
                            : PANEL_HEADER_CURVE_SIZES.bothOrNoPanelsRightSpacer
                    }}
            />
        </View>
    );
};
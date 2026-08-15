import { FC, ReactNode } from "react";
import { CurveSpacer } from "./curve/CurveSpacer";
import { CurvesContainer } from "./curve/CurvesContainer";
import styles from './bottom-tool-panel.module.css';
import { PANEL_HEADER_CURVE_SIZES } from "@apparatus";

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
    bothSidePanels,
    onlyLeftPanel,
    onlyRightPanel,
    joined,
    children
}) => {
    return (
        <div
            className={styles['container']}
            style={{
                gridTemplateColumns: joinHeaderButtons || bothSidePanels
                    ? '1fr max-content 1fr'
                    : onlyLeftPanel
                        ? `1fr max-content ${PANEL_HEADER_CURVE_SIZES.onlyLeftPanelRightSpacer}px`
                        : onlyRightPanel
                            ? `${PANEL_HEADER_CURVE_SIZES.leftSpacer}px max-content 1fr`
                            : `${PANEL_HEADER_CURVE_SIZES.leftSpacer}px max-content 1fr max-content ${PANEL_HEADER_CURVE_SIZES.bothOrNoPanelsRightSpacer}px`
            }}>
            <CurveSpacer />

            <CurvesContainer>
                {children}
                {joined ? sideActions : null}
            </CurvesContainer>

            {!joined ? (
                <>
                    <CurveSpacer />
                    <CurvesContainer>
                        {sideActions}
                    </CurvesContainer>
                </>
            ) : null}

            <CurveSpacer />
        </div>
    );
};

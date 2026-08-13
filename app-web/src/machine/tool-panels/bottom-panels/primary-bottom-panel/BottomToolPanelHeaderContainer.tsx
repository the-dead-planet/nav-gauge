import { FC, ReactNode } from "react";
import { CurveSpacer } from "./curve/CurveSpacer";
import { CurvesContainer } from "./curve/CurvesContainer";
import styles from './bottom-tool-panel.module.css';

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
    console.log({joinHeaderButtons, joined, bothSidePanels, onlyLeftPanel, onlyRightPanel})
    return (
        <div
            className={styles['container']}
            style={{
                gridTemplateColumns: joinHeaderButtons || bothSidePanels
                    ? '1fr max-content 1fr'
                    : onlyLeftPanel
                        ? '1fr max-content 110px'
                        : onlyRightPanel
                            ? '140px max-content 1fr'
                            : '140px max-content 1fr max-content 100px'
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

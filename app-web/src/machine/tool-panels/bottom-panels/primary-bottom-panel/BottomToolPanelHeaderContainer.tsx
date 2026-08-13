import { FC, ReactNode } from "react";
import { useSubjectState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { CurveLeft } from "./curve/CurveLeft";
import { CurveRight } from "./curve/CurveRight";
import { CurveMiddle } from "./curve/CurveMiddle";
import { CurveSpacer } from "./curve/CurveSpacer";
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
    return (
        <div
            className={styles['header']}
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

            <div className={styles['header-content']}>
                <CurveLeft />
                <CurveMiddle />
                <CurveRight />

                {children}
                {joined ? sideActions : null}
            </div>

            {!joined ? (
                <>
                    <CurveSpacer />
                    <div className={styles['header-content']}>
                        <CurveLeft />
                        <CurveMiddle />
                        <CurveRight />

                        {sideActions}
                    </div>
                </>
            ) : null}

            <CurveSpacer />
        </div>
    );
};

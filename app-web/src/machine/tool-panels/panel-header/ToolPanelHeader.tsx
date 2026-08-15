import { FC, ReactNode } from "react";
import { Button } from "@web-ui";
import { ToolPanelPlacement, useToolPanelHeader } from "@apparatus";
import { Icons, } from "@ui";
import { ToolPanelHeaderButton } from "./ToolPanelHeaderButton";
import styles from '../../machine.module.css';

// TODO: Test decrease tool icon size if isLessThanMd

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    headerControls?: ReactNode;
}

export const ToolPanelHeader: FC<Props> = ({
    placement,
    activeId,
    onActiveIdChange,
    headerControls,
}) => {
    const {
        effectivePanels,
        tooltipPlacement,
        getVariant,
        getColor,
        buttonSize,
        expandCollapseLabel,
        handleCollapseExpand,
        onSelect,
    } = useToolPanelHeader(placement, activeId, onActiveIdChange);

    const expandCollapseButton = (
        <Button
            size={buttonSize}
            variant='ghost'
            color={getColor(true)}
            icon={Icons.NounProject.ChevronDownDouble}
            iconRotateZ={((placement === 'left' ? 90 : placement === "right" ? -90 : 0) + (activeId === null ? 180 : 0) + 360) % 360}
            aria-label={expandCollapseLabel}
            tooltip={expandCollapseLabel}
            tooltipPlacement={tooltipPlacement}
            onClick={handleCollapseExpand}
            className={placement === 'bottom' ? undefined : styles['expand-collapse-button']}
        />
    );

    return (
        <div className={styles['content-header']}>
            {effectivePanels.map((toolPanel) => {
                const isActive = toolPanel.id === activeId;

                return (
                    <ToolPanelHeaderButton
                        key={toolPanel.id}
                        toolPanel={toolPanel}
                        tooltipPlacement={tooltipPlacement}
                        buttonSize={buttonSize}
                        variant={getVariant(isActive)}
                        color={getColor(isActive)}
                        isActive={isActive}
                        onClick={onSelect(toolPanel)}
                    />
                )
            })}
            {placement === 'bottom' ? (
                <div className={styles['content-header-controls']}>
                    {headerControls}
                    {expandCollapseButton}
                </div>
            ) : (
                <>
                    <span className={styles['spacer-line']} />
                    {expandCollapseButton}
                </>
            )}
        </div>
    );
};

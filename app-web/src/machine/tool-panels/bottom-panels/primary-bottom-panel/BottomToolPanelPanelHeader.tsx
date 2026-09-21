import { FC } from "react";
import { Button } from "@web-ui";
import { useBottomToolPanelHeader, useTranslate } from "@apparatus";
import { BottomToolPanelHeaderContainer } from "./BottomToolPanelHeaderContainer";

interface Props {
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    joinHeaderButtons?: boolean;
}

export const BottomToolPanelHeader: FC<Props> = ({
    activeId,
    onActiveIdChange,
    joinHeaderButtons,
}) => {
    const translate = useTranslate();

    const {
        effectivePanels,
        buttonProps,
        collapseExpandButtonProps: { accessibilityLabel, ...colExpProps },
        onSelect,
        onCollapseExpand,
        header,
    } = useBottomToolPanelHeader(activeId, onActiveIdChange, { joinHeaderButtons });

    return (
        <BottomToolPanelHeaderContainer
            sideActions={
                <Button
                    aria-label={accessibilityLabel}
                    onClick={onCollapseExpand}
                    {...colExpProps}
                />
            }
            joinHeaderButtons={joinHeaderButtons}
            {...header}
        >
            {effectivePanels.map((toolPanel) => {
                const tooltip = translate(toolPanel.title);
                const isActive = activeId === toolPanel.id;

                return (
                    <Button
                        key={toolPanel.id}
                        active={isActive}
                        icon={toolPanel.icon}
                        aria-label={tooltip}
                        tooltip={tooltip}
                        onClick={onSelect(toolPanel)}
                        {...buttonProps}
                    />
                );
            })}
        </BottomToolPanelHeaderContainer >
    );
};

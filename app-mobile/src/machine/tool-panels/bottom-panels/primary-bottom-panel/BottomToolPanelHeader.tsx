import { FC } from "react";
import { Button, MobileButtonProps } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { useBottomToolPanelHeader, useMachineWard } from "@apparatus";
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
    const { translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);

    const {
        effectivePanels,
        buttonProps,
        collapseExpandButtonProps: { icon: collapseExpandIcon, ...colExpProps },
        onSelect,
        onCollapseExpand,
        header,
    } = useBottomToolPanelHeader(activeId, onActiveIdChange, { joinHeaderButtons});

    return (
        <BottomToolPanelHeaderContainer
            sideActions={
                <Button
                    icon={collapseExpandIcon as unknown as MobileButtonProps['icon']}
                    onPress={onCollapseExpand}
                    {...colExpProps}
                />
            }
            joinHeaderButtons={joinHeaderButtons}
            {...header}
        >
            {effectivePanels.map((toolPanel) => {
                const tooltip = translatron.translate(settings.language, registry, toolPanel.title);
                const isActive = activeId === toolPanel.id;

                return (
                    <Button
                        key={toolPanel.id}
                        active={isActive}
                        icon={toolPanel.icon as unknown as MobileButtonProps['icon']}
                        accessibilityLabel={tooltip}
                        tooltip={tooltip}
                        onPress={onSelect(toolPanel)}
                        {...buttonProps}
                    />
                );
            })}
        </BottomToolPanelHeaderContainer>
    );
};
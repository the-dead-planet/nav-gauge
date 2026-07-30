import { FC } from "react";
import { Button } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { Icons, } from "@ui";
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
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const tooltipPlacement = "top";
    const color = 'primary';
    const buttonSize = 'sm';

    return (
        <BottomToolPanelHeaderContainer
            sideActions={
                <Button
                    size={buttonSize}
                    variant='ghost'
                    color={color}
                    icon={Icons.NounProject.ChevronDownDouble}
                    iconRotateZ={activeId === null ? 180 : 0}
                    aria-label={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                    tooltip={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                    tooltipPlacement={tooltipPlacement}
                    onClick={() => {
                        if (activeId !== null) {
                            onActiveIdChange(null);
                        } else {
                            onActiveIdChange(effectivePanels[0]?.id)
                        }
                    }}
                />
            }
            joinHeaderButtons={joinHeaderButtons}
        >
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant='ghost'
                        color={color}
                        active={isActive}
                        icon={icon}
                        aria-label={tooltip}
                        tooltip={tooltip}
                        tooltipPlacement={tooltipPlacement}
                        showTooltipConnection
                        onClick={() => onActiveIdChange(activeId === id ? null : id)}
                    />
                );
            })}
        </BottomToolPanelHeaderContainer >
    );
};

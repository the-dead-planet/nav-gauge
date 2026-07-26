import { FC } from "react";
import { Button } from "@web-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { Icons, TooltipPlacement, } from "@ui";
import { BottomToolPanelHeaderContainer } from "./BottomToolPanelHeaderContainer";

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const BottomToolPanelHeader: FC<Props> = ({
    placement,
    activeId,
    onActiveIdChange,
}) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement[placement];
    const tooltipPlacement: { [key in ToolPanelPlacement]: TooltipPlacement } = {
        left: "right",
        right: "left",
        bottom: "top",
    };
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
                    tooltipPlacement={tooltipPlacement[placement]}
                    onClick={() => {
                        if (activeId !== null) {
                            onActiveIdChange(null);
                        } else {
                            onActiveIdChange(effectivePanels[0]?.id)
                        }
                    }}
                />
            }
        >
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant={isActive && placement !== 'bottom' ? 'outline' : 'ghost'}
                        color={color}
                        active={isActive}
                        icon={icon}
                        aria-label={tooltip}
                        tooltip={tooltip}
                        tooltipPlacement={tooltipPlacement[placement]}
                        showTooltipConnection
                        onClick={() => onActiveIdChange(activeId === id ? null : id)}
                    />
                );
            })}
        </BottomToolPanelHeaderContainer >
    );
};

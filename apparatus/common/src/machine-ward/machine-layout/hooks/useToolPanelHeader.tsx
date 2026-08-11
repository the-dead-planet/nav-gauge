import { useObservableState, useSubjectState } from "@tinker-chest";
import { ObservedToolPanel, ToolPanelPlacement } from "../../tools-station";
import { ButtonProps, ColorVariant, TooltipPlacement } from "@ui";
import { useMachineWard } from "../../useMachineWard";

export const useToolPanelHeader = (
    placement: ToolPanelPlacement,
    activeId: string | null,
    onActiveIdChange: (activeId: string | null) => void,
) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = placement === "bottom" ? toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]) : toolPanelsByPlacement[placement];
    const tooltipPlacement: { [key in ToolPanelPlacement]: TooltipPlacement } = {
        left: "right",
        right: "left",
        bottom: "top",
    };
    const getVariant = (isActive: boolean): ButtonProps['variant'] => isActive && placement !== 'left' ? 'outline' : 'ghost';
    const getColor = (isActive: boolean): ColorVariant => isActive ? placement === 'bottom' ? 'primary' : 'secondary' : "neutral";
    const buttonSize: ButtonProps['size'] = placement === 'bottom' ? 'sm' : 'md';
    const expandCollapseLabel = translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse });

    const handleCollapseExpand = () => {
        if (activeId !== null) {
            onActiveIdChange(null);
        } else {
            onActiveIdChange(effectivePanels[0]?.id)
        }
    };

    const onSelect = ({ id }: ObservedToolPanel<unknown>) => {
        return () => onActiveIdChange(activeId === id ? null : id);
    };

    return {
        effectivePanels,
        tooltipPlacement: tooltipPlacement[placement],
        getVariant,
        getColor,
        buttonSize,
        expandCollapseLabel,
        handleCollapseExpand,
        onSelect,
    };
};

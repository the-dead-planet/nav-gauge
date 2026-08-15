import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard } from "../../useMachineWard";
import { ButtonProps, ColorVariant, Icons, TooltipPlacement } from "@ui";
import { ObservedToolPanel } from "../../tools-station";

export const useBottomToolPanelHeader = (
    activeId: string | null,
    onActiveIdChange: (activeId: string | null) => void,
    { joinHeaderButtons = false }: { joinHeaderButtons?: boolean } = {}
) => {
    const { toolsStation, namespace, translationKey, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const [activeLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const bothSidePanels = activeLeftPanelToolId !== null && activeRightPanelToolId !== null;
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const tooltipPlacement: TooltipPlacement = "top";
    const color: ColorVariant = 'primary';
    const size: ButtonProps['size'] = 'sm';
    const buttonProps: Partial<ButtonProps> = {
        size,
        variant: 'ghost',
        color,
        tooltipPlacement,
        showTooltipConnection: true,
    };
    const collapseExpandLabel = translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse });
    const collapseExpandButtonProps: Partial<ButtonProps & { icon: typeof Icons.NounProject.ChevronDownDouble; accessibilityLabel: string; }> = {
        icon: Icons.NounProject.ChevronDownDouble,
        iconRotateZ: activeId === null ? 180 : 0,
        size,
        variant: 'ghost',
        color,
        tooltipPlacement,
        accessibilityLabel: collapseExpandLabel,
        tooltip: collapseExpandLabel,
    };

    const onSelect = ({ id }: ObservedToolPanel<unknown>) => {
        return () => onActiveIdChange(activeId === id ? null : id)
    };

    const onCollapseExpand = () => {
        if (activeId !== null) {
            onActiveIdChange(null);
        } else {
            onActiveIdChange(effectivePanels[0]?.id)
        }
    };

    return {
        effectivePanels,
        buttonProps,
        collapseExpandButtonProps,
        onSelect,
        onCollapseExpand,
        header: {
            bothSidePanels,
            onlyLeftPanel: !bothSidePanels && activeLeftPanelToolId !== null,
            onlyRightPanel: !bothSidePanels && activeRightPanelToolId !== null,
            joined: joinHeaderButtons || !(activeLeftPanelToolId === null && activeRightPanelToolId === null),
        }
    };
};

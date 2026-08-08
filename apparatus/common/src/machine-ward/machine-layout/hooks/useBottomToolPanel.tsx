import { useMachineWard } from "../../useMachineWard";
import { useObservableState } from "@tinker-chest";

export const useBottomToolPanel = (activeId: string | null) => {
    const { toolsStation } = useMachineWard();
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const toolPanel = effectivePanels.find(({ id }) => id === activeId);
    const show = effectivePanels.length > 0;

    return { toolPanel, show };
};

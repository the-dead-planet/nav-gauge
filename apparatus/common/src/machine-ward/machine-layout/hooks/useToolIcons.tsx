import { useObservableState } from "@tinker-chest";
import { ToolIconPlacement } from "../../tools-station";
import { useMachineWard } from "../../useMachineWard";

export const useToolIcons = (placement: ToolIconPlacement) => {
    const { toolsStation } = useMachineWard();
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const len = toolIconsByPlacement[placement].length;

    return {
        len,
        hasSpacer: (placement === 'right' && len % 2 === 1) || (placement === 'left' && len > 1),
        toolIconsByPlacement,
    }
};

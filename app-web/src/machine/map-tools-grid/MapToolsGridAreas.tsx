import { FC } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { ToolPanel } from "../tool-panels/ToolPanel";
import { useToolPanelSizeClamp } from "../tool-panels/useToolPanelSizeClamp";
import { ToolIcons } from "./tool-icons/ToolIcons";
import { TopToolsGridArea } from "./TopToolsGridArea";

interface Props {
    map?: maplibregl.Map;
}

export const MapToolsGridAreas: FC<Props> = ({ map }) => {
    const { toolsStation } = useMachineWard();
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);

    useToolPanelSizeClamp();

    return (
        <>
            <ToolPanel
                placement="left"
                map={map}
                activeId={activeLeftPanelToolId}
                onActiveIdChange={setActiveLeftPanelToolId}
            />
            <ToolIcons placement="left" map={map} />
            <TopToolsGridArea map={map} />
            <ToolIcons placement="right" map={map} />
            <ToolPanel
                placement="right"
                map={map}
                activeId={activeRightPanelToolId}
                onActiveIdChange={setActiveRightPanelToolId}
            />
            <ToolPanel
                placement="bottom"
                map={map}
                activeId={activeBottomPanelToolId}
                onActiveIdChange={setActiveBottomPanelToolId}
            />
        </>
    );
};

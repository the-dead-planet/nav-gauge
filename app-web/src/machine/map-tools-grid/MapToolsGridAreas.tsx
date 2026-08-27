import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { useToolPanelSizeClamp } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { SideToolPanel } from "../tool-panels/side-panels/SideToolPanel";
import { ToolIcons } from "./tool-icons/ToolIcons";
import { TopToolsGridArea } from "./TopToolsGridArea";
import { PlaceholderToolPanel } from "../tool-panels/PlaceholderToolPanel";
import { SecondaryBottomToolPanel } from "../tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanel";
import { BottomToolPanel } from "../tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";

interface Props {
    map?: maplibregl.Map;
}

export const MapToolsGridAreas: FC<Props> = ({ map }) => {
    const { toolsStation } = useWebMachineWard();
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);
    const [activeBottomSecondaryPanelToolId, setActiveBottomSecondaryPanelToolId] = useSubjectState(toolsStation.activeBottomSecondaryPanelToolId$);
    const { groupSidePanelsInBottomSecondaryToolbar } = useToolPanelSizeClamp();

    return (
        <>
            {groupSidePanelsInBottomSecondaryToolbar
                ? <PlaceholderToolPanel placement="left" />
                : (
                    <SideToolPanel
                        placement="left"
                        map={map}
                        activeId={activeLeftPanelToolId}
                        onActiveIdChange={setActiveLeftPanelToolId}
                    />
                )}
            <ToolIcons placement="left" map={map} />
            <TopToolsGridArea map={map} />
            <ToolIcons placement="right" map={map} />
            {groupSidePanelsInBottomSecondaryToolbar
                ? <PlaceholderToolPanel placement="right" />
                : (
                    <SideToolPanel
                        placement="right"
                        map={map}
                        activeId={activeRightPanelToolId}
                        onActiveIdChange={setActiveRightPanelToolId}
                    />
                )}
            <BottomToolPanel
                map={map}
                activeId={activeBottomPanelToolId}
                onActiveIdChange={setActiveBottomPanelToolId}
                joinHeaderButtons={groupSidePanelsInBottomSecondaryToolbar}
            />
            {groupSidePanelsInBottomSecondaryToolbar
                ? (
                    <SecondaryBottomToolPanel
                        map={map}
                        activeId={activeBottomSecondaryPanelToolId}
                        onActiveIdChange={setActiveBottomSecondaryPanelToolId}
                    />
                )
                : <PlaceholderToolPanel placement="bottom-secondary" />}
        </>
    );
};

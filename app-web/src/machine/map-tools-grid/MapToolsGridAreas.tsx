import { FC } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { SideToolPanel } from "../tool-panels/side-panels/SideToolPanel";
import { useToolPanelSizeClamp } from "../tool-panels/useToolPanelSizeClamp";
import { ToolIcons } from "./tool-icons/ToolIcons";
import { TopToolsGridArea } from "./TopToolsGridArea";
import { PlaceholderToolPanel } from "../tool-panels/PlaceholderToolPanel";
import { SecondaryBottomToolPanel } from "../tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanel";
import { BottomToolPanel } from "../tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";
import { useTheme } from "@ui";

interface Props {
    map?: maplibregl.Map;
}
// xxs, xs - panels bottom
export const MapToolsGridAreas: FC<Props> = ({ map }) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { toolsStation } = useMachineWard();
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);
    const groupSidePanelsInBottomSecondaryToolbar = media.isLessThanSm;

    useToolPanelSizeClamp();

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
                        activeId={activeRightPanelToolId}
                        onActiveIdChange={setActiveRightPanelToolId}
                    />
                )
                : <PlaceholderToolPanel placement="bottom-secondary" />}
        </>
    );
};

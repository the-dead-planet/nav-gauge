import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard, useToolPanelSizeClamp } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { SideToolPanel } from "../tool-panels/side-panels/SideToolPanel";
import { ToolIcons } from "../map-tools-grid/ToolIcons";
import { TopToolsGridArea } from "../map-tools-grid/TopToolsGridArea";
import { SecondaryBottomToolPanel } from "../tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanel";
import { BottomToolPanel } from "../tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";
import { MobileMap } from "@mobile-apparatus";
import { Attributions } from "../../attributions/Attributions";

const styles = StyleSheet.create({
    mainArea: {
        flex: 1,
        flexDirection: 'row',
    },
});

interface Props {
    map?: MobileMap;
}

export const MapToolsGridAreas: FC<Props> = ({ map }) => {
    const { toolsStation } = useMachineWard();
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);
    const [activeBottomSecondaryPanelToolId, setActiveBottomSecondaryPanelToolId] = useSubjectState(toolsStation.activeBottomSecondaryPanelToolId$);
    const { groupSidePanelsInBottomSecondaryToolbar } = useToolPanelSizeClamp();

    return (
        <>
            <View pointerEvents="box-none" style={styles.mainArea}>
                {groupSidePanelsInBottomSecondaryToolbar
                    ? null
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
                <Attributions />
                <ToolIcons placement="right" map={map} />
                {groupSidePanelsInBottomSecondaryToolbar
                    ? null
                    : (
                        <SideToolPanel
                            placement="right"
                            map={map}
                            activeId={activeRightPanelToolId}
                            onActiveIdChange={setActiveRightPanelToolId}
                        />
                    )}
            </View>
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
                : null}
        </>
    );
};

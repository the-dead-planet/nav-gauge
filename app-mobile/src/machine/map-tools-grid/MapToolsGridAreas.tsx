import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { SideToolPanel } from "../tool-panels/side-panels/SideToolPanel";
import { useToolPanelSizeClamp } from "../tool-panels/useToolPanelSizeClamp";
import { ToolIcons } from "../map-tools-grid/ToolIcons";
import { TopToolsGridArea } from "../map-tools-grid/TopToolsGridArea";
import { PlaceholderToolPanel } from "../tool-panels/PlaceholderToolPanel";
import { SecondaryBottomToolPanel } from "../tool-panels/bottom-panels/secondary-bottom-panel/SecondaryBottomToolPanel";
import { BottomToolPanel } from "../tool-panels/bottom-panels/primary-bottom-panel/BottomToolPanel";
import { useTheme } from "@ui";
import { MobileMap } from "@mobile-ui";
import {
    LEFT_ICONS_WIDTH,
    RIGHT_ICONS_WIDTH,
} from "../tool-panels/tool-panel-size";

const styles = StyleSheet.create({
    mainArea: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: 'green'
    },
    leftColumn: {
        borderWidth: 1,
        borderColor: 'red'
    },
    centerColumn: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'blue',
        height: 40
    },
    rightColumn: {
        borderWidth: 1,
        borderColor: 'red'
    },
});

interface Props {
    map?: MobileMap;
}

export const MapToolsGridAreas: FC<Props> = ({ map }) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { toolsStation } = useMachineWard();
    const [activeLeftPanelToolId, setActiveLeftPanelToolId] = useSubjectState(toolsStation.activeLeftPanelToolId$);
    const [activeRightPanelToolId, setActiveRightPanelToolId] = useSubjectState(toolsStation.activeRightPanelToolId$);
    const [activeBottomPanelToolId, setActiveBottomPanelToolId] = useSubjectState(toolsStation.activeBottomPanelToolId$);
    const [activeBottomSecondaryPanelToolId, setActiveBottomSecondaryPanelToolId] = useSubjectState(toolsStation.activeBottomSecondaryPanelToolId$);
    const groupSidePanelsInBottomSecondaryToolbar = media.isLessThanSm;
    const panelWidths = toolsStation.panelWidths$.value;

    useToolPanelSizeClamp();

    return (
        <>
            <View pointerEvents="box-none" style={styles.mainArea}>
                {groupSidePanelsInBottomSecondaryToolbar
                    ? <PlaceholderToolPanel placement="left" />
                    : (
                        <View
                            style={[styles.leftColumn, {
                                backgroundColor: theme.componentColor('background', .87),
                            }]}>
                            <View style={{ width: panelWidths.leftWidth }}>
                                <SideToolPanel
                                    placement="left"
                                    map={map}
                                    activeId={activeLeftPanelToolId}
                                    onActiveIdChange={setActiveLeftPanelToolId}
                                />
                            </View>
                            <View style={{ width: LEFT_ICONS_WIDTH }}>
                                <ToolIcons placement="left" map={map} />
                            </View>
                        </View>
                    )}

                <View pointerEvents="box-none" style={styles.centerColumn}>
                    <TopToolsGridArea map={map} />
                </View>

                {/* Right: right icons, then right panel (between map and panel) */}
                {groupSidePanelsInBottomSecondaryToolbar
                    ? <PlaceholderToolPanel placement="right" />
                    : (
                        <View style={[styles.rightColumn, {
                            backgroundColor: theme.componentColor('background', .87),
                        }]}>
                            <View style={{ width: RIGHT_ICONS_WIDTH }}>
                                <ToolIcons placement="right" map={map} />
                            </View>
                            <View style={{ width: panelWidths.rightWidth }}>
                                <SideToolPanel
                                    placement="right"
                                    map={map}
                                    activeId={activeRightPanelToolId}
                                    onActiveIdChange={setActiveRightPanelToolId}
                                />
                            </View>
                        </View>
                    )}
            </View>
            <BottomToolPanel
                map={map}
                activeId={activeBottomPanelToolId}
                onActiveIdChange={setActiveBottomPanelToolId}
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

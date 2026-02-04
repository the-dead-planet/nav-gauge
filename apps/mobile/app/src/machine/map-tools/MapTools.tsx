import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from '@mobile-ui';
import { ToolsStation, useMachineWard, useObservableState, useSubjectState, useStateWarden } from "@apparatus";
import { MapViewRef } from "@maplibre/maplibre-react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbox: {

    },
    top: {},
    right: {},
    bottom: {},
    left: {},
});

interface Props {
    map: MapViewRef | null;
    children?: ReactNode;
}

export const MapTools: FC<Props> = ({ map, children }) => {
    const { individuator } = useMachineWard();
    const { toolsStation } = useStateWarden();
    const [orientation] = useSubjectState(individuator.orientation$);
    const toolComponents = useObservableState(toolsStation.toolComponentsByPlacement$, []);
    const toolsByPlacement = toolsStation.getToolsByPlacement(toolComponents)

    return (
        <View style={styles.container}>
            {children}
            {ToolsStation.placements.map((p) => (
                <View key={p} style={[styles.toolbox, styles[p]]}>
                    {toolsByPlacement[p].map(({ id, component: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>
            ))}
        </View>
    );
};

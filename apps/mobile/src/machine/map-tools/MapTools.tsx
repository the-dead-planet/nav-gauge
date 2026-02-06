import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { MapViewRef } from "@maplibre/maplibre-react-native";
import { useMachineWard, useObservableState, useSubjectState, useStateWarden } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainter: {
        flex: 1
    },
    backgroundMap: {
        ...StyleSheet.absoluteFill,
    },
    top: {
        flexDirection: 'row'
    },
    middleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    left: {},
    right: {},
    bottom: {
        flexDirection: 'row'
    },
});

interface Props {
    map: MapViewRef | null;
    children?: ReactNode;
}

export const MapTools: FC<Props> = ({ map, children }) => {
    const { individuator } = useMachineWard();
    const { toolsStation } = useStateWarden();
    const [orientation] = useSubjectState(individuator.orientation$);
    const [controlComponents] = useSubjectState(toolsStation.controlComponents$);
    const toolComponents = useObservableState(toolsStation.toolComponentsByPlacement$, []);
    const toolsByPlacement = toolsStation.getToolsByPlacement(toolComponents)

    return (
        <View style={styles.container}>
            <View>
                {[...controlComponents.entries()].map(([id, ControlComponent]) => <ControlComponent key={id} />)}
            </View>

            <View style={styles.mapContainter}>
                <View style={styles.backgroundMap}>
                    {children}
                </View>
                <View style={styles.top}>
                    {toolsByPlacement.top.map(({ id, component: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>

                <View style={styles.middleRow}>
                    <View style={styles.left}>
                        {toolsByPlacement.left.map(({ id, component: ToolComponent }) => (
                            <ToolComponent key={id} map={map} />
                        ))}
                    </View>

                    <View style={styles.right}>
                        {toolsByPlacement.right.map(({ id, component: ToolComponent }) => (
                            <ToolComponent key={id} map={map} />
                        ))}
                    </View>
                </View>

                <View style={styles.bottom}>
                    {toolsByPlacement.bottom.map(({ id, component: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>
            </View>
        </View>
    );
};

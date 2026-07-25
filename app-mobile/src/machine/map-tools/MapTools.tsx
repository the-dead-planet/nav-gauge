import { FC, ReactNode, useMemo } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapContainer: {
        flex: 1
    },
    backgroundMap: {
        ...StyleSheet.absoluteFill,
    },
    left: {},
    right: {
        marginLeft: 'auto'
    },
    bottom: {
        flexDirection: 'row'
    },
});

interface Props {
    map: MobileMap;
    children?: ReactNode;
}

export const MapTools: FC<Props> = ({ map, children }) => {
    const { toolsStation } = useMachineWard();
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const [onPanResponderStartHandlers] = useSubjectState(map.onPanResponderStartHandlers$);
    const [onPanResponderMoveHandlers] = useSubjectState(map.onPanResponderMoveHandlers$);
    const [onPanResponderEndHandlers] = useSubjectState(map.onPanResponderEndHandlers$);

    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => {
            return true;
        },
        onPanResponderStart: async (event) => {
            if (map.map.current) {
                const lngLat = await map.map.current.unproject([event.nativeEvent.locationX, event.nativeEvent.locationY]);

                for (const [_handlerId, handler] of onPanResponderStartHandlers) {
                    handler(lngLat, event);
                }
            }
        },
        onPanResponderMove: async (event) => {
            if (map.map.current) {
                const lngLat = await map.map.current.unproject([event.nativeEvent.locationX, event.nativeEvent.locationY]);

                for (const [_handlerId, handler] of onPanResponderMoveHandlers) {
                    handler(lngLat, event);
                }
            }
        },
        onPanResponderEnd: async (event) => {
            if (map.map.current) {
                const lngLat = await map.map.current.unproject([event.nativeEvent.locationX, event.nativeEvent.locationY]);

                for (const [_handlerId, handler] of onPanResponderEndHandlers) {
                    handler(lngLat, event);
                }
            }
        },
    }), [map, onPanResponderStartHandlers, onPanResponderMoveHandlers, onPanResponderEndHandlers]);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <View style={styles.backgroundMap} {...panResponder.panHandlers}>
                    {children}
                </View>

                <View style={styles.left}>
                    {toolPanelsByPlacement.left.map(({ id, contentComponent: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>

                <View style={styles.right}>
                    {toolPanelsByPlacement.right.map(({ id, contentComponent: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>
            </View>

            <View style={styles.bottom}>
                {toolPanelsByPlacement.bottom.map(({ id, contentComponent: ToolComponent }) => (
                    <ToolComponent key={id} map={map} />
                ))}
            </View>
        </View>
    );
};

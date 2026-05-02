import { FC, ReactNode, useMemo } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import { useObservableState, useSubjectState, useStateWarden } from "@apparatus";
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
    top: {
        flexDirection: 'row'
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
    const { toolsStation } = useStateWarden();
    const [controlComponents] = useSubjectState(toolsStation.controlComponents$);
    const toolComponents = useObservableState(toolsStation.toolComponentsByPlacement$, []);
    const toolsByPlacement = toolsStation.getToolsByPlacement(toolComponents);
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
            <View>
                {[...controlComponents.entries()].map(([id, ControlComponent]) => <ControlComponent key={id} />)}
            </View>

            <View style={styles.mapContainer}>
                <View style={styles.backgroundMap} {...panResponder.panHandlers}>
                    {children}
                </View>
                <View style={styles.top}>
                    {toolsByPlacement.top.map(({ id, component: ToolComponent }) => (
                        <ToolComponent key={id} map={map} />
                    ))}
                </View>

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
    );
};

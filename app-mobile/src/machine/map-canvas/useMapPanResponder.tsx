import { useMemo } from "react";
import { GestureResponderEvent, PanResponder } from "react-native";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";

type PanHandler = (lngLat: number[], event: GestureResponderEvent) => Promise<void>;

const dispatch = async (
    map: MobileMap,
    handlers: ReadonlyMap<string, PanHandler>,
    event: GestureResponderEvent,
) => {
    const mapRef = map.map$.value;
    if (!mapRef) {
        return;
    }

    const lngLat = await mapRef.unproject([event.nativeEvent.locationX, event.nativeEvent.locationY]);
    for (const handler of handlers.values()) {
        handler(lngLat, event);
    }
};

export const useMapPanResponder = (map: MobileMap) => {
    const [onPanResponderStartHandlers] = useSubjectState(map.onPanResponderStartHandlers$);
    const [onPanResponderMoveHandlers] = useSubjectState(map.onPanResponderMoveHandlers$);
    const [onPanResponderEndHandlers] = useSubjectState(map.onPanResponderEndHandlers$);

    return useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderStart: (event) => dispatch(map, onPanResponderStartHandlers, event),
        onPanResponderMove: (event) => dispatch(map, onPanResponderMoveHandlers, event),
        onPanResponderEnd: (event) => dispatch(map, onPanResponderEndHandlers, event),
        onPanResponderTerminate: (event) => dispatch(map, onPanResponderEndHandlers, event),
    }), [
        map,
        onPanResponderStartHandlers,
        onPanResponderMoveHandlers,
        onPanResponderEndHandlers,
    ]);
};

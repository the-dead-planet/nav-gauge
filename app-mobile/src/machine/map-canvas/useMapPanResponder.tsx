import { useMemo } from "react";
import { GestureResponderEvent, PanResponder } from "react-native";
import { MobileMap } from "@mobile-apparatus";

type PanHandler = (
    lngLat: number[],
    event: GestureResponderEvent,
    cancelled?: boolean,
) => Promise<void>;

const dispatch = async (
    map: MobileMap,
    handlers: ReadonlyMap<string, PanHandler>,
    event: GestureResponderEvent,
    cancelled = false,
) => {
    const mapRef = map.map$.value;
    if (!mapRef || !handlers.size) {
        return;
    }
    const { locationX, locationY } = event.nativeEvent;
    const [offsetX, offsetY] = map.panResponderOffset;
    const lngLat = await mapRef.unproject([locationX + offsetX, locationY + offsetY]);
    await Promise.all(
        [...handlers.values()].map((handler) =>
            handler(lngLat, event, cancelled),
        ),
    );
};

export const useMapPanResponder = (map: MobileMap) =>
    useMemo(() => {
        let acceptingMoves = false;
        let latestMove: GestureResponderEvent | null = null;
        let startTask = Promise.resolve();
        let endTask = Promise.resolve();
        let moveTask: Promise<void> | null = null;
        let gestureVersion = 0;

        const processMoves = () => {
            if (moveTask || !acceptingMoves || !latestMove) {
                return;
            }
            const version = gestureVersion;
            const ready = startTask;
            moveTask = (async () => {
                await ready;
                while (
                    acceptingMoves &&
                    latestMove &&
                    version === gestureVersion
                ) {
                    const event = latestMove;
                    latestMove = null;
                    await dispatch(
                        map,
                        map.onPanResponderMoveHandlers$.value,
                        event,
                    );
                }
            })().finally(() => {
                moveTask = null;
                processMoves();
            });
        };

        const finish = (event: GestureResponderEvent, cancelled: boolean) => {
            event.persist();
            acceptingMoves = false;
            latestMove = null;
            const ready = startTask;
            const moving = moveTask;
            endTask = (async () => {
                try {
                    await ready;
                    await moving;
                    await dispatch(
                        map,
                        map.onPanResponderEndHandlers$.value,
                        event,
                        cancelled,
                    );
                } finally {
                    map.panResponderOffset = [0, 0];
                    map.dragPan$.next(true);
                }
            })();
            return endTask;
        };

        return PanResponder.create({
            onStartShouldSetPanResponderCapture: (event) =>
                [...map.onPanResponderShouldStartHandlers$.value.values()].some((handler) => handler(event)),
            onShouldBlockNativeResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: (event) => {
                event.persist();
                map.dragPan$.next(false);
                gestureVersion++;
                acceptingMoves = true;
                latestMove = null;
                startTask = endTask.then(async () => {
                    map.panResponderOffset = [0, 0];
                    await Promise.all([...map.onPanResponderStartHandlers$.value.values()].map((handler) => handler(event)));
                });
                return startTask;
            },
            onPanResponderMove: (event) => {
                if (acceptingMoves) {
                    event.persist();
                    latestMove = event;
                    processMoves();
                }
            },
            onPanResponderRelease: (event) => finish(event, false),
            onPanResponderTerminate: (event) => finish(event, true),
        });
    }, [map]);

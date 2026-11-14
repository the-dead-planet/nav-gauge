import { act, renderHook } from "@testing-library/react-native";
import {
    GestureResponderEvent,
    PanResponder,
    PanResponderGestureState,
} from "react-native";
import { BehaviorSubject } from "rxjs";
import { MobileMap } from "@mobile-apparatus";
import { useMapPanResponder } from "../src/machine/map-canvas/useMapPanResponder";

test("keeps the responder stable, coalesces stale moves, and marks cancellation", async () => {
    const create = jest.spyOn(PanResponder, "create");
    const moves: number[] = [];
    const ended = jest.fn(
        async (
            _coordinate: number[],
            _event: GestureResponderEvent,
            _cancelled?: boolean,
        ) => {},
    );
    const unproject = jest.fn(async (point: number[]) => point);
    const map = {
        panResponderOffset: [0, 0],
        map$: new BehaviorSubject({ unproject }),
        onPanResponderStartHandlers$: new BehaviorSubject(
            new Map([["image", async () => {}]]),
        ),
        onPanResponderMoveHandlers$: new BehaviorSubject(
            new Map([
                [
                    "image",
                    async (coordinate: number[]) => {
                        moves.push(coordinate[0]);
                    },
                ],
            ]),
        ),
        onPanResponderEndHandlers$: new BehaviorSubject(
            new Map([["image", ended]]),
        ),
    } as unknown as MobileMap;
    const gesture = {} as PanResponderGestureState;
    const event = (locationX: number): GestureResponderEvent =>
        ({
            persist: jest.fn(),
            nativeEvent: { locationX, locationY: 0 },
        }) as unknown as GestureResponderEvent;
    const hook = await renderHook(() => useMapPanResponder(map));

    try {
        const responder = hook.result.current;
        const callbacks = create.mock.calls[0][0];
        await callbacks.onPanResponderGrant?.(event(0), gesture);
        expect(unproject).not.toHaveBeenCalled();
        let releaseProjection: (coordinate: number[]) => void = () => {
            throw new Error("Projection was not started");
        };
        unproject.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    releaseProjection = resolve;
                }),
        );
        await act(async () => {
            callbacks.onPanResponderMove?.(event(1), gesture);
            await Promise.resolve();
            callbacks.onPanResponderMove?.(event(2), gesture);
            callbacks.onPanResponderMove?.(event(3), gesture);
            callbacks.onPanResponderMove?.(event(4), gesture);
            releaseProjection([1, 0]);
            await new Promise<void>((resolve) => setImmediate(resolve));
        });
        expect(moves).toEqual([1, 4]);
        await callbacks.onPanResponderRelease?.(event(5), gesture);
        expect(ended.mock.calls[0][0]).toEqual([5, 0]);

        map.onPanResponderMoveHandlers$.next(new Map());
        await hook.rerender(undefined);
        expect(hook.result.current).toBe(responder);
        expect(create).toHaveBeenCalledTimes(1);

        await callbacks.onPanResponderGrant?.(event(6), gesture);
        map.panResponderOffset = [0, 35];
        await callbacks.onPanResponderTerminate?.(event(7), gesture);
        expect(ended.mock.calls[1][0]).toEqual([7, 35]);
        expect(map.panResponderOffset).toEqual([0, 0]);
        callbacks.onPanResponderMove?.(event(8), gesture);
        expect(ended.mock.calls[1][2]).toBe(true);
        expect(moves).toEqual([1, 4]);
    } finally {
        await hook.unmount();
        create.mockRestore();
    }
});

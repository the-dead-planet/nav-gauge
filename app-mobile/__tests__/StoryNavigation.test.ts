import { act, renderHook } from "@testing-library/react-native";
import { BackHandler } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { topBarBackAction$ } from "@mobile-ui";
import { useStoryNavigation } from "@the-dead-planet/nav-gauge-ui-mobile/src/storybook/useStoryNavigation";
import { useFilesBackNavigation } from "../src/machine/debug/files/useFilesBackNavigation";

jest.mock("@react-navigation/native", () => ({ useIsFocused: jest.fn() }));
jest.mock("@mobile-ui", () => jest.requireActual("../../ui/mobile/src/tinkers"));

test("Stories yields Back to Files and restores its selection-aware action when returning", async () => {
    const listeners = new Set<Parameters<typeof BackHandler.addEventListener>[1]>();
    const subscription = jest.spyOn(BackHandler, "addEventListener").mockImplementation((_event, handler) => {
        listeners.add(handler);
        return {
            remove: () => {
                listeners.delete(handler);
            },
        };
    });
    const { result, rerender, unmount } = await renderHook<
        ReturnType<typeof useStoryNavigation>,
        { storiesFocused: boolean }
    >(
        ({ storiesFocused }) => {
            jest.mocked(useIsFocused).mockReturnValue(!storiesFocused);
            const stories = useStoryNavigation(storiesFocused);
            useFilesBackNavigation(undefined);
            return stories;
        },
        { initialProps: { storiesFocused: true } },
    );
    try {
        await act(() =>
            result.current.setSelectedGroup({
                name: "Controls",
                description: "",
                entries: [],
            }),
        );
        expect(topBarBackAction$.value?.onBack).toBeDefined();
        await rerender({ storiesFocused: false });
        expect(listeners.size).toBe(1);
        expect([...listeners][0]({ type: "hardwareBackPress", timeStamp: 0 })).toBe(false);
        expect(result.current.selectedGroup?.name).toBe("Controls");
        await rerender({ storiesFocused: true });
        expect(listeners.size).toBe(1);
        expect(topBarBackAction$.value?.onBack).toBeDefined();
        await act(() => topBarBackAction$.value?.onBack?.());
        expect(result.current.selectedGroup).toBeNull();
    } finally {
        await unmount();
        subscription.mockRestore();
    }
});

import { act, renderHook } from "@testing-library/react-native";
import { BackHandler } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { topBarBackAction$ } from "@mobile-ui";
import { useFilesBackNavigation } from "../src/machine/debug/files/useFilesBackNavigation";

jest.mock("@react-navigation/native", () => ({ useIsFocused: jest.fn() }));
jest.mock("@mobile-ui", () => {
    const { BehaviorSubject } =
        jest.requireActual<typeof import("rxjs")>("rxjs");
    return { topBarBackAction$: new BehaviorSubject(null) };
});

afterEach(() => jest.restoreAllMocks());

test("uses folder-aware Back for both the top bar and Android, only while focused", async () => {
    jest.mocked(useIsFocused).mockReturnValue(true);
    let onHardwareBack: (() => boolean | null | undefined) | undefined;
    const remove = jest.fn();
    jest.spyOn(BackHandler, "addEventListener").mockImplementation(
        (_event, handler) => {
            onHardwareBack = () =>
                handler({ type: "hardwareBackPress", timeStamp: 0 });
            return { remove };
        },
    );
    const onBack = jest.fn();
    const { rerender, unmount } = await renderHook(() =>
        useFilesBackNavigation(onBack),
    );
    expect(topBarBackAction$.value?.onBack).toBe(onBack);
    await act(() => {
        expect(onHardwareBack?.()).toBe(true);
    });
    expect(onBack).toHaveBeenCalledTimes(1);
    jest.mocked(useIsFocused).mockReturnValue(false);
    await rerender({});
    expect(topBarBackAction$.value).toBeNull();
    expect(remove).toHaveBeenCalled();
    await unmount();
});

test("lets Android navigate out of Files when already at the location tiles", async () => {
    jest.mocked(useIsFocused).mockReturnValue(true);
    let onHardwareBack: (() => boolean | null | undefined) | undefined;
    jest.spyOn(BackHandler, "addEventListener").mockImplementation(
        (_event, handler) => {
            onHardwareBack = () =>
                handler({ type: "hardwareBackPress", timeStamp: 0 });
            return { remove: jest.fn() };
        },
    );
    const { unmount } = await renderHook(() =>
        useFilesBackNavigation(undefined),
    );
    expect(onHardwareBack?.()).toBe(false);
    await unmount();
});

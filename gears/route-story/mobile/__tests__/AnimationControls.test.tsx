import { act, renderHook } from "@testing-library/react-native";
import { BehaviorSubject } from "rxjs";
import { CameraRef } from "@maplibre/maplibre-react-native";
import { MarkerImage } from "@apparatus";
import { Animatrix } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useMobileAnimationControls } from "../src/animation-controls/useMobileAnimationControls";
import { MobileMarkerImageData } from "../src/images/image-parser";

jest.mock("@apparatus", () => ({
    useMultipleTranslations: (keys: { t: string }[]) => keys.map(({ t }) => t),
    useTranslate:
        () =>
        ({ t }: { t: string }) =>
            t,
    glitchmitter: { transmit: jest.fn() },
}));

jest.mock("@mobile-apparatus", () => ({
    useMobileMachineWard: () => ({
        chronoLens: { isPlaying$: mockIsPlaying },
    }),
}));

jest.mock("@the-dead-planet/nav-gauge-gears-route-story-common", () => ({
    ...jest.requireActual(
        "@the-dead-planet/nav-gauge-gears-route-story-common/src/animatrix/animatrix",
    ),
    ...jest.requireActual(
        "@the-dead-planet/nav-gauge-gears-route-story-common/src/animatrix/useAnimationControls",
    ),
}));

const mockIsPlaying = new BehaviorSubject(false);

test("shares timing totals and search, and previews native camera changes only while paused", async () => {
    const animatrix = new Animatrix();
    const images$ = new BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>([
        { id: 1, name: "Displayed", progress: 1, featureId: 0 },
        { id: 2, name: "Unassigned", progress: 1 },
    ]);
    const camera: CameraRef = {
        jumpTo: jest.fn(),
        easeTo: jest.fn(),
        flyTo: jest.fn(),
        fitBounds: jest.fn(),
        zoomTo: jest.fn(),
        setStop: jest.fn(() => Promise.resolve()),
    };
    const map = { camera$: new BehaviorSubject<CameraRef | null>(camera) };
    const { result, unmount } = await renderHook(() =>
        useMobileAnimationControls(animatrix, images$, map),
    );
    expect(result.current.displayedImageCount).toBe(1);
    expect(result.current.totalRecordingDuration).toBe(33000);
    await act(() => {
        result.current.setAnimationControls((previous) => ({
            ...previous,
            displayImageDuration: 5000,
            routePlaybackDuration: 60000,
        }));
    });
    expect(result.current.totalRecordingDuration).toBe(65000);

    await act(() => animatrix.searchQuery$.next("DISTANCE"));
    expect(result.current.showGeneral).toBe(true);
    expect(result.current.showFollowCurrentPoint).toBe(false);
    await act(() => animatrix.searchQuery$.next("pitch"));
    expect(result.current.showGeneral).toBe(false);
    expect(result.current.showFollowCurrentPoint).toBe(true);
    expect(result.current.matchesSearch(result.current.pitchLabel)).toBe(true);

    await act(() => {
        result.current.changeZoom(100);
        result.current.changePitch(100);
    });
    expect(animatrix.controls$.value.cameraZoom).toBe(20);
    expect(animatrix.controls$.value.cameraTilt).toBe(85);
    expect(camera.zoomTo).toHaveBeenLastCalledWith(20, { duration: 0 });
    expect(camera.setStop).toHaveBeenLastCalledWith({ pitch: 85, duration: 0 });

    await act(() => mockIsPlaying.next(true));
    await act(() => {
        result.current.changeZoom(10);
        result.current.changePitch(30);
    });
    expect(animatrix.controls$.value.cameraZoom).toBe(10);
    expect(animatrix.controls$.value.cameraTilt).toBe(30);
    expect(camera.zoomTo).toHaveBeenCalledTimes(1);
    expect(camera.setStop).toHaveBeenCalledTimes(1);
    await unmount();
    mockIsPlaying.next(false);
});

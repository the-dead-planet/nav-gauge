import { act, renderHook } from "@testing-library/react-native";
import { BehaviorSubject } from "rxjs";
import { useBottomToolPanelHeader } from "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/machine-layout/hooks/useBottomToolPanelHeader";

jest.mock(
    "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/useMachineWard",
    () => ({
        useMachineWard: () => ({
            toolsStation: mockToolsStation,
            namespace: "apparatus",
            translationKey: { Expand: "expand", Collapse: "collapse" },
        }),
    }),
);

jest.mock(
    "@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/translatron",
    () => ({
        useTranslate:
            () =>
            ({ t }: { t: string }) =>
                t,
    }),
);

const mockToolsStation = {
    activeLeftPanelToolId$: new BehaviorSubject<string | null>(null),
    activeRightPanelToolId$: new BehaviorSubject<string | null>(null),
    toolPanelsByPlacement$: new BehaviorSubject([]),
    getToolPanelsByPlacement: () => ({ bottom: [] }),
};

test.each([
    ["carto", null],
    [null, "animation"],
    ["carto", "animation"],
])(
    "restores portrait header spacing after rotation with remembered panels (%s, %s)",
    async (leftPanel, rightPanel) => {
        mockToolsStation.activeLeftPanelToolId$.next(null);
        mockToolsStation.activeRightPanelToolId$.next(null);
        const { result, rerender, unmount } = await renderHook(
            ({ grouped }: { grouped: boolean }) =>
                useBottomToolPanelHeader(null, jest.fn(), {
                    joinHeaderButtons: grouped,
                }),
            { initialProps: { grouped: true } },
        );
        const portraitHeader = {
            bothSidePanels: false,
            onlyLeftPanel: false,
            onlyRightPanel: false,
            joined: true,
        };
        expect(result.current.header).toEqual(portraitHeader);

        await rerender({ grouped: false });
        await act(() => {
            mockToolsStation.activeLeftPanelToolId$.next(leftPanel);
            mockToolsStation.activeRightPanelToolId$.next(rightPanel);
        });
        expect(result.current.header).toEqual({
            bothSidePanels: leftPanel !== null && rightPanel !== null,
            onlyLeftPanel: leftPanel !== null && rightPanel === null,
            onlyRightPanel: rightPanel !== null && leftPanel === null,
            joined: true,
        });

        await rerender({ grouped: true });
        expect(result.current.header).toEqual(portraitHeader);
        expect(mockToolsStation.activeLeftPanelToolId$.value).toBe(leftPanel);
        expect(mockToolsStation.activeRightPanelToolId$.value).toBe(rightPanel);
        await unmount();
    },
);

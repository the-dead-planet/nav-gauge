import { act, renderHook } from '@testing-library/react-native';
import { useObservableState } from '@tinker-chest';
import { ObservedToolIcon } from '@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/tools-station/model';
import { ToolsStation } from '@the-dead-planet/nav-gauge-apparatus-common/src/machine-ward/tools-station/tools-station';

test('observed tool icons preserve native component functions without invoking them', async () => {
    const initialIcon = jest.fn(() => null);
    const nextIcon = jest.fn(() => null);
    const station = new ToolsStation<unknown>();
    const toolIcon = station.addToolIcon('images', {
        placement: 'left',
        icon: initialIcon as unknown as string,
        tooltip: {
            n: 'test',
            t: 'images',
        },
    });
    const { result, unmount } = await renderHook(() =>
        useObservableState<ObservedToolIcon<unknown>[]>(station.toolIconsByPlacement$, []),
    );

    expect(result.current[0].icon).toBe(initialIcon);
    expect(initialIcon).not.toHaveBeenCalled();

    await act(() => toolIcon.icon$.next(nextIcon as unknown as string));
    expect(result.current[0].icon).toBe(nextIcon);
    expect(nextIcon).not.toHaveBeenCalled();

    await act(() => toolIcon.icon$.next(undefined));
    expect(result.current[0].icon).toBeUndefined();

    await unmount();
    expect(toolIcon.icon$.observed).toBe(false);
    station.cleanUp();
});

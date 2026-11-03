import { render, fireEvent } from '@testing-library/react-native';
import { Platform, StyleSheet } from 'react-native';
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeMode,
    ThemeName,
    themeSpecifications,
} from '@ui';
import {
    resolveElevationFilter,
    resolveElevationStyle,
    resolveLayerStyle,
} from '../../src/design-system/theme';
import { HexagonalPanel } from '../../src/hud/hexagonal-panel';
import { NotchedPanel } from '../../src/hud/notched-panel';
import { OctagonalPanel } from '../../src/hud/octagonal-panel';

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 800,
        windowHeight: 600,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

describe('Mobile surface shadows', () => {
    afterEach(() => jest.restoreAllMocks());

    it.each<ThemeMode>(['light', 'dark'])(
        'uses shape-aware directional shadows without native elevation in %s mode',
        (mode) => {
            jest.replaceProperty(Platform, 'OS', 'android');
            jest.spyOn(Platform, 'Version', 'get').mockReturnValue(31);
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
                false,
            );
            const raised = theme.elevation('raised', 'up');
            const overlay = theme.layer('dialog', 'left');
            expect(resolveElevationStyle(theme, 'raised', 'up')).toEqual({
                filter: [
                    {
                        dropShadow: {
                            offsetX: 0,
                            offsetY: raised.offset.y,
                            standardDeviation: raised.blur / 2,
                            color: `rgba(0, 0, 0, ${raised.opacity})`,
                        },
                    },
                ],
            });
            expect(resolveLayerStyle(theme, 'dialog', 'left')).toEqual({
                zIndex: overlay.zIndex,
                filter: [
                    {
                        dropShadow: {
                            offsetX: overlay.elevation.offset.x,
                            offsetY: 0,
                            standardDeviation: overlay.elevation.blur / 2,
                            color: `rgba(0, 0, 0, ${overlay.elevation.opacity})`,
                        },
                    },
                ],
            });
            expect(resolveElevationStyle(theme, 'none')).toEqual({});
            expect(resolveElevationFilter(theme, 'raised', 'up')).toBe(
                `0px ${raised.offset.y}px ${raised.blur / 2}px rgba(0, 0, 0, ${raised.opacity})`,
            );
            theme.destroy();
        },
    );

    it.each([27, 30])(
        'retains supported shadows on Android API %s',
        (version) => {
            jest.replaceProperty(Platform, 'OS', 'android');
            jest.spyOn(Platform, 'Version', 'get').mockReturnValue(version);
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            const elevation = theme.elevation('raised');
            const style = resolveElevationStyle(theme, 'raised');
            if (version >= 28) {
                expect(style).toEqual({
                    boxShadow: `0px ${elevation.offset.y}px ${elevation.blur}px rgba(0, 0, 0, ${elevation.opacity})`,
                });
            } else {
                expect(style).toEqual({
                    shadowColor: elevation.color,
                    shadowOffset: {
                        width: elevation.offset.x,
                        height: elevation.offset.y,
                    },
                    shadowOpacity: elevation.opacity,
                    shadowRadius: elevation.blur / 2,
                    elevation: elevation.depth,
                });
            }
            theme.destroy();
        },
    );

    it.each([
        { name: 'HexagonalPanel', Component: HexagonalPanel },
        { name: 'NotchedPanel', Component: NotchedPanel },
        { name: 'OctagonalPanel', Component: OctagonalPanel },
    ])(
        '$name uses an alpha-mask shadow instead of a rectangular elevation outline',
        async ({ Component }) => {
            jest.replaceProperty(Platform, 'OS', 'android');
            jest.spyOn(Platform, 'Version', 'get').mockReturnValue(31);
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            const screen = await render(
                <ThemeContext.Provider value={theme}>
                    <Component
                        variant="fill-translucent"
                        accessibilityLabel="Surface"
                    >
                        Surface content
                    </Component>
                </ThemeContext.Provider>,
            );
            const panel = screen.getByLabelText('Surface');
            await fireEvent(panel, 'layout', {
                nativeEvent: { layout: { x: 0, y: 0, width: 200, height: 60 } },
            });
            const panelStyle = StyleSheet.flatten(panel.props.style);
            expect(panelStyle.elevation).toBeUndefined();
            expect(panelStyle.boxShadow).toBeUndefined();
            expect(panelStyle.filter).toEqual(
                resolveElevationStyle(theme, 'raised', 'down').filter,
            );
            expect(screen.getByText('Surface content')).toBeTruthy();
            await screen.unmount();
            theme.destroy();
        },
    );
});

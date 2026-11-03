import { render, fireEvent } from '@testing-library/react-native';
import { Platform, StyleSheet } from 'react-native';
import Svg, {
    FeComposite,
    FeGaussianBlur,
    Filter,
    Polygon,
} from 'react-native-svg';
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
import { HudShadow } from '../../src/hud/HudShadow';

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
        'uses directional box shadows without native elevation in %s mode',
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
                boxShadow: `0px ${raised.offset.y}px ${raised.blur}px rgba(0, 0, 0, ${raised.opacity})`,
            });
            expect(resolveLayerStyle(theme, 'dialog', 'left')).toEqual({
                zIndex: overlay.zIndex,
                boxShadow: `${overlay.elevation.offset.x}px 0px ${overlay.elevation.blur}px rgba(0, 0, 0, ${overlay.elevation.opacity})`,
            });
            expect(resolveElevationFilter(theme, 'raised', 'up')).toBe(
                `0px ${raised.offset.y}px ${raised.blur / 2}px rgba(0, 0, 0, ${raised.opacity})`,
            );
            theme.destroy();
        },
    );

    it('retains native shadow support on Android versions without box shadows', () => {
        jest.replaceProperty(Platform, 'OS', 'android');
        jest.spyOn(Platform, 'Version', 'get').mockReturnValue(27);
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].light,
            media,
            false,
        );
        const elevation = theme.elevation('raised');
        expect(resolveElevationStyle(theme, 'raised')).toEqual({
            shadowColor: elevation.color,
            elevation: elevation.depth,
        });
        theme.destroy();
    });

    it.each([
        { name: 'HexagonalPanel', Component: HexagonalPanel },
        { name: 'NotchedPanel', Component: NotchedPanel },
        { name: 'OctagonalPanel', Component: OctagonalPanel },
    ])(
        '$name casts an exterior polygon shadow, not a rectangular view shadow',
        async ({ Component }) => {
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
            const shadow = screen.UNSAFE_getByType(HudShadow);
            expect(shadow.props.elevation).toEqual(
                theme.elevation('raised', 'down'),
            );
            const shadowSvg = shadow.findByType(Svg);
            expect(shadowSvg.props.width).toBeGreaterThan(200);
            expect(shadowSvg.props.height).toBeGreaterThan(60);
            expect(shadowSvg.props.pointerEvents).toBe('none');
            expect(shadow.findByType(Filter).props.filterUnits).toBe(
                'userSpaceOnUse',
            );
            expect(shadow.findByType(FeGaussianBlur).props.stdDeviation).toBe(
                theme.elevation('raised').blur / 2,
            );
            expect(
                shadow
                    .findAllByType(FeComposite)
                    .some(
                        (composite) =>
                            composite.props.operator === 'out' &&
                            composite.props.in2 === 'SourceAlpha',
                    ),
            ).toBe(true);
            expect(shadow.findByType(Polygon).props.points).toBe(
                shadow.props.points,
            );
            await screen.unmount();
            theme.destroy();
        },
    );
});

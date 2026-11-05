import { render, fireEvent } from '@testing-library/react-native';
import { Animated, StyleSheet } from 'react-native';
import { pick } from '@react-native-documents/picker';
import {
    Orientation,
    ColorShade,
    fillVariantOptions,
    sizeOptions,
    Icons,
    Theme,
    ThemeContext,
    ThemeName,
    ThemeMode,
    themeSpecifications,
    actionButtonVariants,
    useTheme,
} from '@ui';
import { Dialog } from '../../src/rigs/dialog';
import { Button } from '../../src/gizmos/button';
import { Text } from '../../src/design-system/typography';
import { FileInput } from '../../src/forms/file-input';
import { Tabstrip } from '../../src/rigs/tabstrip';
import * as tabstripLayout from '../../src/rigs/tabstrip/useTabstripLayout';
import { Menu, MenuItem } from '../../src/rigs/menu';
import { Icon } from '../../src/design-system/icons';

jest.mock(
    '../../src/design-system/icons',
    () => ({
        Icon: jest.fn(() => null),
    }),
);

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 24, right: 0, bottom: 48, left: 0 }),
}));

jest.mock('@react-native-documents/picker', () => ({ pick: jest.fn() }));

jest.mock(
    '../../src/rigs/popup/usePopupPosition',
    () => ({
        usePopupPosition: () => ({
            overlayRef: { current: null },
            popupPosition: {},
            onLayout: jest.fn(),
        }),
    }),
);

const media = {
    initial: () => ({
        orientation: Orientation.Portrait,
        windowWidth: 360,
        windowHeight: 800,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

const TranslatedLabel = () => 'Individuator';
const ChildThemeLabel = () => {
    const theme = useTheme();
    return <Text>{`Child theme: ${theme.mode}`}</Text>;
};

describe('Mobile rig content', () => {
    beforeEach(() => {
        jest.spyOn(Animated, 'timing').mockReturnValue({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        });
    });

    afterEach(() => jest.restoreAllMocks());

    it('matches a ghost filename to its icons in the map theme and preserves default filenames', async () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const content = (ghost = true) => (
            <ThemeContext.Provider value={theme}>
                <FileInput
                    type={['public.item']}
                    color="primary"
                    fileName="route.gpx"
                    fileNameProps={ghost ? { variant: 'ghost' } : undefined}
                    fileLabel="Upload"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file"
                    purgeText="Purge route?"
                    onUpload={() => undefined}
                    onPurge={() => undefined}
                />
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        const ghostColor = theme.color('primary', 700);
        expect(screen.getByText('route.gpx')).toHaveStyle({ color: ghostColor });
        expect(screen.getByText('route.gpx')).toHaveProp('numberOfLines', 1);
        expect(screen.getByText('route.gpx')).toHaveProp('ellipsizeMode', 'middle');
        expect(screen.getByText('route.gpx')).toHaveStyle({ flexGrow: 1, flexShrink: 1 });
        expect(screen.getByText('route.gpx')).not.toHaveStyle({ flex: 1 });
        expect(jest.mocked(Icon).mock.lastCall?.[0].color).toBe(ghostColor);
        await screen.rerender(content(false));
        expect(screen.getByText('route.gpx')).toHaveStyle({ color: theme.color('primary', 900) });
        await screen.unmount();
        theme.destroy();
    });

    it('keeps FileInput labels independent of button interaction and disables both actions', async () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const onPurge = jest.fn();
        const content = (disabled = false, fileName: string | null = 'route.gpx') => (
            <ThemeContext.Provider value={theme}>
                <FileInput
                    type={['public.item']}
                    color="hazard"
                    highlightColor="intel"
                    variant="outline"
                    fileUploadButtonProps={{ variant: 'fill', color: 'secured', disabled: false }}
                    purgeButtonProps={{ variant: 'ghost', color: 'intel', disabled: false }}
                    purgeConfirmationDialogProps={{
                        color: 'secured',
                        variant: 'fill-translucent',
                    }}
                    fileName={fileName}
                    fileLabel="Upload"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file"
                    purgeText="Remove this file?"
                    disabled={disabled}
                    onUpload={() => undefined}
                    onPurge={onPurge}
                />
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(screen.getByRole('button', { name: 'Upload' })).toHaveStyle({
            backgroundColor: theme.resolveAppearance('fill', 'secured').surface,
        });
        expect(screen.getByRole('button', { name: 'Purge' })).toHaveStyle({
            backgroundColor: 'transparent',
        });
        await fireEvent(screen.getByRole('button', { name: 'Upload' }), 'pressIn');
        expect(screen.getByText('route.gpx')).toHaveStyle({ color: theme.color('hazard', 900) });
        await fireEvent.press(screen.getByRole('button', { name: 'Purge' }));
        expect(screen.getByText('Remove this file?')).toHaveStyle({ color: theme.color('secured', 900) });
        expect(screen.getByRole('header')).toHaveStyle({ color: theme.color('secured', 900) });
        const confirmationPanel = screen.getAllByLabelText('Purge').find((element) => element.props.accessibilityViewIsModal);
        expect(confirmationPanel).toHaveStyle({
            backgroundColor: theme.resolveAppearance('fill-translucent', 'secured').surface,
        });
        expect(onPurge).not.toHaveBeenCalled();
        jest.mocked(Animated.timing).mockReturnValue({
            start: jest.fn((callback?: (result: { finished: boolean }) => void) => callback?.({ finished: true })),
            stop: jest.fn(),
            reset: jest.fn(),
        });
        await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.queryByText('Remove this file?')).toBeNull();
        expect(onPurge).not.toHaveBeenCalled();
        await fireEvent.press(screen.getByRole('button', { name: 'Purge' }));
        await fireEvent.press(screen.getAllByRole('button', { name: 'Purge' })[1]);
        expect(onPurge).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Remove this file?')).toBeNull();
        await screen.rerender(content(true));
        expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Purge' })).toBeDisabled();
        expect(screen.getByText('route.gpx')).toHaveStyle({ color: theme.color('hazard', 300) });
        await screen.rerender(content(false, null));
        expect(screen.getByRole('button', { name: 'Upload' })).not.toBeDisabled();
        expect(screen.getByRole('button', { name: 'Purge' })).toBeDisabled();
        await screen.unmount();
        theme.destroy();
    });

    it('reports FileInput upload loading and errors, then allows retrying', async () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const error = new Error('Cannot read file');
        const file = {
            uri: 'file:///route.gpx',
            name: 'route.gpx',
            error: null,
            type: null,
            nativeType: null,
            size: null,
            isVirtual: false,
            convertibleToMimeTypes: null,
            hasRequestedType: true,
        };
        jest.mocked(pick).mockRejectedValueOnce(error).mockResolvedValueOnce([file]);
        const onUpload = jest.fn();
        const onError = jest.fn();
        const onIsLoadingChange = jest.fn();
        const screen = await render(
            <ThemeContext.Provider value={theme}>
                <FileInput
                    type={['public.item']}
                    fileName={null}
                    fileLabel="Upload"
                    purgeLabel="Purge"
                    cancelLabel="Cancel"
                    noNameLabel="No file"
                    purgeText="Remove this file?"
                    onUpload={onUpload}
                    onPurge={() => undefined}
                    onError={onError}
                    onIsLoadingChange={onIsLoadingChange}
                />
            </ThemeContext.Provider>,
        );
        await fireEvent.press(screen.getByRole('button', { name: 'Upload' }));
        expect(onError).toHaveBeenCalledWith(error);
        expect(onUpload).not.toHaveBeenCalled();
        expect(onIsLoadingChange.mock.calls).toEqual([[true], [false]]);
        await fireEvent.press(screen.getByRole('button', { name: 'Upload' }));
        expect(onUpload).toHaveBeenCalledWith([file]);
        expect(onIsLoadingChange.mock.calls).toEqual([[true], [false], [true], [false]]);
        await screen.unmount();
        theme.destroy();
    });

    it.each<ThemeMode>(['light', 'dark'])(
        'matches ghost typography to icon glyphs in %s mode with explicit overrides',
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            const content = (highlighted = false, disabled = false, shade?: ColorShade) => (
                <ThemeContext.Provider value={theme}>
                    <Text
                        variant="ghost"
                        color="primary"
                        highlighted={highlighted}
                        disabled={disabled}
                        shade={shade}
                    >
                        Route name
                    </Text>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            expect(screen.getByText('Route name')).toHaveStyle({
                color: theme.color('primary', mode === 'light' ? 700 : 300),
            });
            await screen.rerender(content(false, false, 500));
            expect(screen.getByText('Route name')).toHaveStyle({
                color: theme.color('primary', 500),
            });
            await screen.rerender(content(true, false, 500));
            expect(screen.getByText('Route name')).toHaveStyle({
                color: theme.color('primary', mode === 'light' ? 900 : 100),
            });
            await screen.rerender(content(true, true, 500));
            expect(screen.getByText('Route name')).toHaveStyle({
                color: theme.color('primary', mode === 'light' ? 300 : 700),
            });
            await screen.unmount();
            theme.destroy();
        },
    );

    it('inherits the nearest provider for typography interaction and disabled colors', async () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme.forMode('dark')}>
                <Text color="primary" highlighted disabled={disabled}>
                    Dark text
                </Text>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(screen.getByText('Dark text')).toHaveStyle({
            color: theme.forMode('dark').resolveAppearance(undefined, 'primary', 'primary', 'active-pressed').glyphs,
        });
        await screen.rerender(content(true));
        expect(screen.getByText('Dark text')).toHaveStyle({
            color: theme.forMode('dark').resolveAppearance(undefined, 'primary', 'primary', 'disabled').glyphs,
        });
        await screen.unmount();
        theme.destroy();
    });

    it.each(sizeOptions)('sizes %s tabstrip actions like the tab buttons', async (size) => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const close = jest.fn();
        const reset = jest.fn();
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <Tabstrip
                    options={[]}
                    value="route"
                    onChange={() => undefined}
                    overflowAccessibilityLabel="More tabs"
                    variant="fill-translucent"
                    size={size}
                    disabled={disabled}
                    actions={{
                        primary: {
                            label: 'Close tabs',
                            onPress: close,
                        },
                        secondary: {
                            label: 'Reset tabs',
                            onPress: reset,
                        },
                    }}
                >
                    Tab content
                </Tabstrip>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        for (const name of ['Close tabs', 'Reset tabs']) {
            expect(screen.getByRole('button', { name })).toHaveStyle({
                height: theme.sizes.control[size].height,
            });
            expect(screen.getByText(name)).toHaveStyle({
                fontSize: theme.sizes.control[size].fontSize,
            });
        }
        await fireEvent.press(screen.getByRole('button', { name: 'Close tabs' }));
        await fireEvent.press(screen.getByRole('button', { name: 'Reset tabs' }));
        expect(close).toHaveBeenCalledTimes(1);
        expect(reset).toHaveBeenCalledTimes(1);
        await screen.rerender(content(true));
        await fireEvent.press(screen.getByRole('button', { name: 'Close tabs' }));
        expect(close).toHaveBeenCalledTimes(1);
        await screen.unmount();
        theme.destroy();
    });

    it('keeps translucent button icons shadow-free, including when disabled', async () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <Button
                    variant="fill-translucent"
                    color="primary"
                    icon={() => null}
                    accessibilityLabel="Icon button"
                    disabled={disabled}
                />
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(jest.mocked(Icon).mock.lastCall?.[0].filter).toBeUndefined();
        await screen.rerender(content(true));
        expect(jest.mocked(Icon).mock.lastCall?.[0].filter).toBeUndefined();
        await screen.unmount();
        theme.destroy();
    });

    it.each(fillVariantOptions)(
        'uses a filled selected tab on %s without forcing pressed styling',
        async (variant) => {
            jest.spyOn(tabstripLayout, 'useTabstripLayout').mockReturnValue({
                setContainerWidth: jest.fn(),
                optionWidths: [80, 80],
                overflowWidth: 80,
                setOverflowWidth: jest.fn(),
                visibleIndexes: [0, 1],
                setOptionWidth: jest.fn(),
                selectTab: jest.fn(),
            });
            const theme = new Theme(
                themeSpecifications[ThemeName.Default].light,
                media,
                false,
            );
            const options = [
                {
                    value: 'route',
                    label: 'Route',
                },
                {
                    value: 'terrain',
                    label: 'Terrain',
                },
            ];
            const content = (value: string) => (
                <ThemeContext.Provider value={theme}>
                    <Tabstrip
                        variant={variant}
                        color="primary"
                        highlightColor="intel"
                        options={options}
                        value={value}
                        onChange={() => undefined}
                        overflowAccessibilityLabel="More tabs"
                    >
                        Tab content
                    </Tabstrip>
                </ThemeContext.Provider>
            );
            const screen = await render(content('route'));
            const selectedFill = theme.resolveAppearance('fill', 'primary').surface;
            const inactiveFill = theme.resolveAppearance(
                actionButtonVariants[variant].inactive,
                'primary',
            ).surface;
            expect(screen.getByRole('tab', { selected: true })).toHaveStyle({
                backgroundColor: selectedFill,
            });
            expect(screen.getByRole('tab', { selected: false })).toHaveStyle({
                backgroundColor: inactiveFill,
            });
            await screen.rerender(content('terrain'));
            expect(
                screen.getByRole('tab', { name: 'Terrain', selected: true }),
            ).toHaveStyle({ backgroundColor: selectedFill });
            await screen.unmount();
            theme.destroy();
        },
    );

    it.each<ThemeMode>(['light', 'dark'])(
        'uses the dialog foreground for its heading and bare text in %s mode',
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
                false,
            );
            for (const variant of fillVariantOptions) {
                const screen = await render(
                    <ThemeContext.Provider value={theme}>
                        <Dialog
                            variant={variant}
                            color="primary"
                            header="Readable heading"
                            closeText="Close"
                            onClose={() => undefined}
                        >
                            Bare dialog text
                            <ChildThemeLabel />
                        </Dialog>
                    </ThemeContext.Provider>,
                );
                const glyphs = theme.resolveAppearance(variant, 'primary').glyphs;
                expect(screen.getByRole('button', { name: 'Close' })).toHaveStyle({
                    backgroundColor: theme.resolveAppearance(
                        actionButtonVariants[variant].inactive,
                        'primary',
                    ).surface,
                });
                expect(screen.getByRole('header')).toHaveStyle({
                    color: glyphs,
                });
                expect(screen.getByText('Bare dialog text')).toHaveStyle({
                    color: glyphs,
                });
                expect(screen.getByText(`Child theme: ${mode}`)).toBeTruthy();
                if (variant === 'fill-translucent' && mode === 'dark') {
                    expect(screen.getByRole('header')).toHaveStyle({
                        textShadowColor: theme.color('primary', 800),
                        textShadowRadius: 1,
                        textShadowOffset: { width: -1, height: 0 },
                    });
                    expect(screen.getByText('Bare dialog text')).not.toHaveStyle({
                        textShadowColor: theme.color('primary', 800),
                    });
                    expect(screen.getByText('Close')).not.toHaveStyle({
                        textShadowColor: theme.color('primary', 800),
                    });
                }
                await screen.unmount();
            }
            theme.destroy();
        },
    );

    it.each<ThemeMode>(['light', 'dark'])(
        'inherits %s mode in the dialog frame and content',
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode === 'light' ? 'dark' : 'light'],
                media,
                false,
            );
            const dialogTheme = theme.forMode(mode);
            for (const variant of fillVariantOptions) {
                const screen = await render(
                    <ThemeContext.Provider value={dialogTheme}>
                        <Dialog
                            variant={variant}
                            color="intel"
                            header="Themed dialog"
                            closeText="Close"
                            onClose={() => undefined}
                        >
                            Bare dialog text
                            <ChildThemeLabel />
                        </Dialog>
                    </ThemeContext.Provider>,
                );
                const appearance = dialogTheme.resolveAppearance(variant, 'intel');
                expect(screen.getByLabelText('Themed dialog')).toHaveStyle({ backgroundColor: appearance.surface });
                expect(screen.getByRole('header')).toHaveStyle({ color: appearance.glyphs });
                expect(screen.getByText('Bare dialog text')).toHaveStyle({ color: appearance.glyphs });
                expect(screen.getByText(`Child theme: ${mode}`)).toBeTruthy();
                expect(screen.getByRole('button', { name: 'Close' })).toHaveStyle({
                    backgroundColor: dialogTheme.resolveAppearance(actionButtonVariants[variant].inactive, 'intel').surface,
                });
                await screen.unmount();
            }
            theme.destroy();
        },
    );

    it.each<ThemeMode>(['light', 'dark'])(
        'can disable the neutral dialog backdrop in %s mode without removing the dialog',
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode === 'light' ? 'dark' : 'light'],
                media,
                false,
            );
            const interpolate = jest.spyOn(Animated.Value.prototype, 'interpolate');
            const content = (backdrop?: boolean) => (
                <ThemeContext.Provider value={theme.forMode(mode)}>
                    <Dialog
                        backdrop={backdrop}
                        variant="fill-translucent"
                        header="Themed backdrop"
                        closeText="Close"
                        onClose={() => undefined}
                    >
                        Dialog content
                    </Dialog>
                </ThemeContext.Provider>
            );
            const shade = mode === 'light' ? 100 : 900;
            const backdropInterpolation = {
                inputRange: [0, 1],
                outputRange: [theme.color('neutral', shade, 0), theme.color('neutral', shade, 0.6)],
            };
            const screen = await render(content());
            expect(interpolate).toHaveBeenCalledWith(backdropInterpolation);
            interpolate.mockClear();
            await screen.rerender(content(false));
            expect(interpolate).not.toHaveBeenCalledWith(backdropInterpolation);
            expect(screen.getByLabelText('Themed backdrop')).toBeTruthy();
            expect(screen.getByText('Dialog content')).toBeTruthy();
            expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
            await screen.unmount();
            theme.destroy();
        },
    );

    it('keeps the trigger highlight override out of menu item press colors', async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].dark,
            media,
            false,
        );
        const content = (highlightColor?: 'primary') => (
            <ThemeContext.Provider value={theme}>
                <Menu
                    iconActiveColor="secondary"
                    highlightColor={highlightColor}
                    triggerAccessibilityLabel="Open menu"
                >
                    <MenuItem onPress={() => undefined}>Row action</MenuItem>
                </Menu>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        await fireEvent.press(
            screen.getByRole('button', { name: 'Open menu' }),
        );
        expect(jest.mocked(Icon).mock.lastCall?.[0].color).toEqual(
            theme.resolveAppearance(
                'ghost',
                'neutral',
                'secondary',
                'active-pressed',
            ).glyphs,
        );
        await fireEvent(
            screen.getByRole('button', { name: 'Row action' }),
            'pressIn',
        );
        expect(screen.getByRole('button', { name: 'Row action' })).toHaveStyle({
            backgroundColor: theme.resolveAppearance(
                'menu-item',
                'neutral',
                'neutral',
                'active-pressed',
            ).surface,
        });
        await screen.rerender(content('primary'));
        expect(screen.getByRole('button', { name: 'Row action' })).toHaveStyle({
            backgroundColor: theme.resolveAppearance(
                'menu-item',
                'neutral',
                'primary',
                'active-pressed',
            ).surface,
        });
        expect(jest.mocked(Icon).mock.lastCall?.[0].color).toEqual(
            theme.resolveAppearance(
                'ghost',
                'neutral',
                'secondary',
                'active-pressed',
            ).glyphs,
        );
        await screen.unmount();
        theme.destroy();
    });

    it('renders translated menu labels inside text and preserves disabled appearance', async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].dark,
            media,
            false,
        );
        const onPress = jest.fn();
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <MenuItem
                    color="intel"
                    size="lg"
                    disabled={disabled}
                    onPress={onPress}
                >
                    <TranslatedLabel />
                </MenuItem>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(screen.getByText('Individuator')).toHaveStyle({
            color: theme.resolveAppearance('menu-item', 'intel').glyphs,
            fontSize: theme.sizes.control.lg.fontSize,
        });
        await screen.rerender(content(true));
        expect(screen.getByText('Individuator')).toHaveStyle({
            color: theme.resolveAppearance(
                'menu-item',
                'intel',
                'intel',
                'disabled',
            ).glyphs,
        });
        await fireEvent.press(screen.getByRole('button'));
        expect(onPress).not.toHaveBeenCalled();
        await screen.unmount();
        theme.destroy();
    });

    it.each<ThemeMode>(['light', 'dark'])(
        'uses pressed appearance for selection and keeps disabled dominant in %s mode',
        async (mode) => {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
                false,
            );
            const onPress = jest.fn();
            const content = (
                selected = false,
                highlighted = false,
                disabled = false,
            ) => (
                <ThemeContext.Provider value={theme}>
                    <MenuItem
                        color="glitch"
                        highlightColor="intel"
                        selected={selected}
                        highlighted={highlighted}
                        disabled={disabled}
                        onPress={onPress}
                    >
                        Route
                    </MenuItem>
                </ThemeContext.Provider>
            );
            const screen = await render(content());
            const expectFill = (shade: ColorShade) => {
                expect(screen.getByRole('radio')).toHaveStyle({
                    backgroundColor: theme.color('intel', shade),
                });
                expect(screen.getByText('Route')).toHaveStyle({
                    color: theme.color(
                        'intel',
                        theme.contrastShade('intel', shade),
                    ),
                });
            };
            expect(screen.getByRole('radio')).toHaveStyle({
                backgroundColor: 'transparent',
            });
            await fireEvent(screen.getByRole('radio'), 'focus');
            expectFill(mode === 'light' ? 300 : 700);
            await fireEvent(screen.getByRole('radio'), 'pressIn');
            expectFill(mode === 'light' ? 400 : 600);
            await fireEvent(screen.getByRole('radio'), 'pressOut');
            await fireEvent(screen.getByRole('radio'), 'blur');
            await screen.rerender(content(true));
            expectFill(mode === 'light' ? 400 : 600);
            expect(
                screen.getByRole('radio').props.accessibilityState.checked,
            ).toBe(true);
            await fireEvent(screen.getByRole('radio'), 'focus');
            expectFill(mode === 'light' ? 400 : 600);
            await screen.rerender(content(true, true));
            expectFill(mode === 'light' ? 400 : 600);
            await screen.rerender(content(true, true, true));
            expect(screen.getByRole('radio')).toHaveStyle({
                backgroundColor: 'transparent',
                outlineWidth: 0,
            });
            expect(screen.getByText('Route')).toHaveStyle({
                color: theme.color('glitch', mode === 'light' ? 300 : 700),
            });
            await fireEvent.press(screen.getByRole('radio'));
            expect(onPress).not.toHaveBeenCalled();
            await screen.unmount();
            theme.destroy();
        },
    );

    it('renders a string dialog body and reserves small-screen system insets', async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].dark,
            media,
            false,
        );
        const screen = await render(
            <ThemeContext.Provider value={theme}>
                <Dialog
                    header="Settings"
                    closeText="Close"
                    onClose={() => undefined}
                >
                    Configure your next expedition.
                </Dialog>
            </ThemeContext.Provider>,
        );
        expect(screen.getByText('Configure your next expedition.')).toHaveStyle(
            {
                color: theme.resolveAppearance('fill-inverse').glyphs,
            },
        );
        const panel = screen.getByLabelText('Settings');
        expect(panel).toHaveStyle({
            maxHeight: '100%',
            width: '100%',
            flexShrink: 1,
        });
        expect(panel).not.toHaveStyle({ flex: 1 });
        expect(screen.getByRole('header')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
        let content = screen.getByText(
            'Configure your next expedition.',
        ).parent;
        while (
            content &&
            StyleSheet.flatten(content.props.style)?.flexGrow !== 0
        ) {
            content = content.parent;
        }
        expect(content).toHaveStyle({
            flexGrow: 0,
            flexShrink: 1,
            minHeight: 0,
        });
        let parent = screen.getByText('Configure your next expedition.').parent;
        let hasSafeArea = false;
        while (parent) {
            const style = StyleSheet.flatten(parent.props.style);
            if (style?.paddingTop === 24 && style.paddingBottom === 48) {
                hasSafeArea = true;
                break;
            }
            parent = parent.parent;
        }
        expect(hasSafeArea).toBe(true);
        await screen.unmount();
        theme.destroy();
    });

    it('gives navigation items link semantics and keeps their indicator in the owner glyph color', async () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].light,
            media,
            false,
        );
        const content = (disabled = false) => (
            <ThemeContext.Provider value={theme}>
                <MenuItem
                    linkType="internal"
                    color="glitch"
                    highlightColor="intel"
                    disabled={disabled}
                >
                    Stories
                </MenuItem>
            </ThemeContext.Provider>
        );
        const screen = await render(content());
        expect(screen.getAllByRole('link')).toHaveLength(1);
        expect(jest.mocked(Icon).mock.lastCall?.[0]).toMatchObject({
            icon: Icons.NounProject.NavigateTo,
            size: 'sm',
            color: theme.resolveAppearance('menu-item', 'glitch', 'intel')
                .glyphs,
        });
        await fireEvent(screen.getByRole('link'), 'focus');
        expect(jest.mocked(Icon).mock.lastCall?.[0].color).toEqual(
            theme.resolveAppearance(
                'menu-item',
                'glitch',
                'intel',
                'hover-focus',
            ).glyphs,
        );
        await screen.rerender(content(true));
        expect(jest.mocked(Icon).mock.lastCall?.[0].color).toEqual(
            theme.resolveAppearance('menu-item', 'glitch', 'intel', 'disabled')
                .glyphs,
        );
        await screen.unmount();
        theme.destroy();
    });
});

import { render, fireEvent } from '@testing-library/react-native';
import { Animated, StyleSheet } from 'react-native';
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from '@ui';
import { Dialog } from '@the-dead-planet/nav-gauge-ui-mobile/src/rigs/dialog';
import { MenuItem } from '@the-dead-planet/nav-gauge-ui-mobile/src/rigs/menu';

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 24, right: 0, bottom: 48, left: 0 }),
}));

const media = {
    initial: () => ({
        orientation: Orientation.Portrait,
        windowWidth: 360,
        windowHeight: 800,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
};

const TranslatedLabel = () => 'Individuator';

describe('Mobile rig content', () => {
    beforeEach(() => {
        jest.spyOn(Animated, 'timing').mockReturnValue({
            start: jest.fn(),
            stop: jest.fn(),
            reset: jest.fn(),
        });
    });

    afterEach(() => jest.restoreAllMocks());

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
            color: theme.resolveAppearance('ghost', 'intel').glyphs,
            fontSize: theme.sizes.control.lg.fontSize,
        });
        await screen.rerender(content(true));
        expect(screen.getByText('Individuator')).toHaveStyle({
            color: theme.resolveAppearance(
                'ghost',
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
});

import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
    DEFAULT_SIZE,
    Orientation,
    Theme,
    ThemeContext,
    ThemeName,
    themeSpecifications,
} from '@ui';
import {
    GallerySizeContext,
    VariantGallery,
} from '@the-dead-planet/nav-gauge-ui-mobile/src/storybook/VariantGallery';

it('renders a single gallery size and follows the drawer size context', async () => {
    const theme = new Theme(themeSpecifications[ThemeName.Default].light, {
        initial: () => ({
            orientation: Orientation.Portrait,
            windowWidth: 360,
            windowHeight: 800,
        }),
        subscribe: () => ({ unsubscribe: () => undefined }),
    });
    const gallery = (
        <VariantGallery
            colors={['primary']}
            variants={['fill']}
            render={({ size }) => <Text>{`Rendered ${size}`}</Text>}
        />
    );
    const screen = await render(
        <ThemeContext.Provider value={theme}>{gallery}</ThemeContext.Provider>,
    );
    expect(screen.getAllByText(/^Rendered /)).toHaveLength(1);
    expect(screen.getByText(`Rendered ${DEFAULT_SIZE}`)).toBeTruthy();
    await screen.rerender(
        <ThemeContext.Provider value={theme}>
            <GallerySizeContext.Provider value="lg">
                {gallery}
            </GallerySizeContext.Provider>
        </ThemeContext.Provider>,
    );
    expect(screen.getAllByText(/^Rendered /)).toHaveLength(1);
    expect(screen.getByText('Rendered lg')).toBeTruthy();
    await screen.unmount();
    theme.destroy();
});

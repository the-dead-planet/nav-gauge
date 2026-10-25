import {
    appearanceColorOptions,
    DEFAULT_COLOR,
    colorOptions,
    fillVariantOptions,
    sizeOptions,
} from '../../design-system/tinkers';
import { SizeVariant, StatusColor } from '../../design-system/model';
import { Theme } from '../../design-system/theme/theme';
import { ThemeName, ThemeSpecification } from '../../design-system/theme/model';
import {
    themeModeOptions,
    themeNameOptions,
} from '../../design-system/theme/specifications';
import { StoryControls } from '../../storybook/model';
import { ThemeSelectColorPreview, ThemeSelectStoryProps } from './model';

export const themeSelectColorBoxSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
};

export const themeSelectStoryArgs: ThemeSelectStoryProps = {
    mode: 'dark',
    value: ThemeName.Default,
    color: DEFAULT_COLOR,
    size: 'sm',
    variant: 'fill-inverse',
};

export const themeSelectStoryControls: StoryControls<ThemeSelectStoryProps> = {
    mode: {
        control: 'select',
        options: themeModeOptions.map(({ value }) => value),
    },
    value: {
        control: 'select',
        options: themeNameOptions.map(({ value }) => value),
    },
    color: {
        control: 'select',
        options: appearanceColorOptions,
    },
    size: {
        control: 'select',
        options: sizeOptions,
    },
    variant: {
        control: 'select',
        options: fillVariantOptions,
    },
};

export const getThemeColorPreviewGroups = (
    specification: ThemeSpecification,
): ThemeSelectColorPreview[][] => {
    const colors = Theme.resolveColors(specification);
    const statusColors = appearanceColorOptions.filter(
        (color) => !colorOptions.includes(color),
    );

    return [colorOptions, statusColors].map((group) =>
        group.map((role) => {
            const color = colors[role];
            const paletteName =
                Object.entries(Theme.palette).find(
                    ([, paletteColor]) => paletteColor === color,
                )?.[0] ?? 'custom';
            return {
                role,
                name: `${role} - ${paletteName.replaceAll('-', ' ')}`,
                color,
                shade:
                    specification.statusColors[role as StatusColor]?.shade ??
                    500,
            };
        }),
    );
};

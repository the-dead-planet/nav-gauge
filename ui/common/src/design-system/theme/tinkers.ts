import type { ColorShade, SpacingVariant } from '../model';
import type { Breakpoint, ElevationLevel, ThemeElevation, ElevationLayer, ThemeLayerPolicy, ThemeMode, ThemeSizes } from './model';

export const allColorShades: ColorShade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const themeSizes: ThemeSizes = {
    control: {
        xs: {
            height: 18,
            fontSize: 12,
            iconSize: 12,
            gap: 4,
            paddingInline: 16,
            paddingBlock: 0,
            iconPaddingInline: 2,
        },
        sm: {
            height: 24,
            fontSize: 12,
            iconSize: 14,
            gap: 6,
            paddingInline: 16,
            paddingBlock: 2,
            iconPaddingInline: 3,
        },
        md: {
            height: 32,
            fontSize: 14,
            iconSize: 16,
            gap: 10,
            paddingInline: 16,
            paddingBlock: 6,
            iconPaddingInline: 5,
        },
        lg: {
            height: 40,
            fontSize: 16,
            iconSize: 20,
            gap: 12,
            paddingInline: 20,
            paddingBlock: 8,
            iconPaddingInline: 8,
        },
    },
};

export const themeBreakpointThresholds: Record<Breakpoint, number> = {
    xxs: 0,
    xs: 480,
    sm: 600,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1600,
    xxxl: 1920,
};

export const themeSpacing: Record<SpacingVariant, string> = {
    xs: '6px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
};

export const themeLayers: Record<ElevationLayer, ThemeLayerPolicy> = {
    'hud-connector': {
        zIndex: 2,
        elevation: 'none',
    },
    popup: {
        zIndex: 1000,
        elevation: 'overlay',
    },
    floating: {
        zIndex: 1100,
        elevation: 'floating',
    },
    dialog: {
        zIndex: 5000,
        elevation: 'overlay',
    },
    dropdown: {
        zIndex: 6000,
        elevation: 'overlay',
    },
    'tooltip-connector': {
        zIndex: 9998,
        elevation: 'none',
    },
    tooltip: {
        zIndex: 10000,
        elevation: 'floating',
    },
};

export const themeProperties = {
    disabledOpacity: 0.4,
};

export const elevationSpecifications: Record<ThemeMode, Record<ElevationLevel, ThemeElevation>> = {
    light: {
        none: {
            distance: 0,
            blur: 0,
            opacity: 0,
            depth: 0,
        },
        raised: {
            distance: 2,
            blur: 8,
            opacity: 0.1,
            depth: 4,
        },
        floating: {
            distance: 4,
            blur: 12,
            opacity: 0.18,
            depth: 6,
        },
        overlay: {
            distance: 8,
            blur: 24,
            opacity: 0.22,
            depth: 8,
        },
    },
    dark: {
        none: {
            distance: 0,
            blur: 0,
            opacity: 0,
            depth: 0,
        },
        raised: {
            distance: 2,
            blur: 10,
            opacity: 0.24,
            depth: 4,
        },
        floating: {
            distance: 4,
            blur: 14,
            opacity: 0.36,
            depth: 6,
        },
        overlay: {
            distance: 8,
            blur: 30,
            opacity: 0.5,
            depth: 8,
        },
    },
};

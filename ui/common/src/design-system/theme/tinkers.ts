import type { SpacingVariant } from '../model';
import type { Breakpoint, ElevationLevel, ThemeElevation, ElevationLayer, ThemeLayerPolicy, ThemeMode, ThemeSizes } from './model';

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
    chip: {
        xs: {
            fontSize: 10,
            lineHeight: 12,
            iconSize: 12,
            gap: 4,
            paddingInline: 3,
            paddingBlock: 1,
        },
        sm: {
            fontSize: 12,
            lineHeight: 16,
            iconSize: 16,
            gap: 6,
            paddingInline: 4,
            paddingBlock: 2,
        },
        md: {
            fontSize: 14,
            lineHeight: 18,
            iconSize: 20,
            gap: 8,
            paddingInline: 8,
            paddingBlock: 4,
        },
        lg: {
            fontSize: 16,
            lineHeight: 20,
            iconSize: 24,
            gap: 10,
            paddingInline: 10,
            paddingBlock: 6,
        },
    },
    tooltip: {
        xs: {
            fontSize: 11,
            lineHeight: 12.1,
            paddingInline: 6,
            paddingBlock: 2,
        },
        sm: {
            fontSize: 12,
            lineHeight: 16.8,
            paddingInline: 10,
            paddingBlock: 4,
        },
        md: {
            fontSize: 14,
            lineHeight: 19.6,
            paddingInline: 12,
            paddingBlock: 6,
        },
        lg: {
            fontSize: 16,
            lineHeight: 22.4,
            paddingInline: 14,
            paddingBlock: 8,
        },
    },
    hudDecoration: {
        xs: {
            offset: 3,
            strokeWidth: 1,
        },
        sm: {
            offset: 5,
            strokeWidth: 1.5,
        },
        md: {
            offset: 7,
            strokeWidth: 2,
        },
        lg: {
            offset: 9,
            strokeWidth: 2.5,
        },
    },
    tabstrip: {
        xs: {
            padding: 6,
        },
        sm: {
            padding: 10,
        },
        md: {
            padding: 14,
        },
        lg: {
            padding: 18,
        },
    },
    menuList: {
        xs: {
            paddingBlock: 6,
        },
        sm: {
            paddingBlock: 6,
        },
        md: {
            paddingBlock: 12,
        },
        lg: {
            paddingBlock: 12,
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

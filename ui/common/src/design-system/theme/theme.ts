import { BehaviorSubject } from 'rxjs';
import {
    Breakpoint,
    Media,
    MediaSubscriptionDefinition,
    MediaWithBreakpoints,
    PaletteColor,
    RGBColor,
    ThemeColor,
    ThemeStatusColors,
    ThemeSpecification,
    ThemeSizes,
    ThemeMode,
    ThemeAppearancePaint,
    ThemeAppearancePolicy,
    ThemeAppearanceInsetEffect,
    ThemeAppearanceInsetEffectPolicy,
    ThemeVariantShades,
    ResolvedThemeAppearance,
    ThemeAppearanceState,
    ThemeAppearanceBorder,
    ElevationDirection,
    ElevationLevel,
    ResolvedThemeElevation,
    ResolvedThemeLayer,
    ThemeElevation,
    ThemeLayer,
    ThemeLayerPolicy,
    ThemeSurfaceColorRole,
} from "./model";
import { ColorShade, ColorVariant, DesignSystemColor, SpacingVariant, StatusColor, SurfaceVariant } from '../model';

interface OklchColor {
    lightness: number;
    chroma: number;
    hue: number;
}

const neutralPaletteLightness = {
    50: 0.964214,
    100: 0.907304,
    900: 0.238684,
} as const;

const toLinearRgbChannel = (channel: number): number => {
    const normalizedChannel = channel / 255;
    return normalizedChannel <= 0.04045
        ? normalizedChannel / 12.92
        : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
};

const fillContrastLightnessThreshold = 0.7;

const themeSizes: ThemeSizes = {
    control: {
        xs: {
            height: 24,
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

const elevations: Record<ThemeMode, Record<ElevationLevel, ThemeElevation>> = {
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

const toOklch = ({ r, g, b }: RGBColor): OklchColor => {
    const linearRed = toLinearRgbChannel(r);
    const linearGreen = toLinearRgbChannel(g);
    const linearBlue = toLinearRgbChannel(b);
    const long = Math.cbrt(0.4122214708 * linearRed + 0.5363325363 * linearGreen + 0.0514459929 * linearBlue);
    const medium = Math.cbrt(0.2119034982 * linearRed + 0.6806995451 * linearGreen + 0.1073969566 * linearBlue);
    const short = Math.cbrt(0.0883024619 * linearRed + 0.2817188376 * linearGreen + 0.6299787005 * linearBlue);
    const lightness = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
    const axisA = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short;
    const axisB = 0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short;

    return {
        lightness,
        chroma: Math.hypot(axisA, axisB),
        hue: Math.atan2(axisB, axisA),
    };
};

const toSrgbChannel = (channel: number): number => channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * channel ** (1 / 2.4) - 0.055;

const toRgb = ({ lightness, chroma, hue }: OklchColor): RGBColor | null => {
    const axisA = chroma * Math.cos(hue);
    const axisB = chroma * Math.sin(hue);
    const long = (lightness + 0.3963377774 * axisA + 0.2158037573 * axisB) ** 3;
    const medium = (lightness - 0.1055613458 * axisA - 0.0638541728 * axisB) ** 3;
    const short = (lightness - 0.0894841775 * axisA - 1.291485548 * axisB) ** 3;
    const channels = [
        4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
        -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
        -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
    ].map(toSrgbChannel);

    if (channels.some((channel) => channel < 0 || channel > 1)) {
        return null;
    }

    return {
        r: Math.round(channels[0] * 255),
        g: Math.round(channels[1] * 255),
        b: Math.round(channels[2] * 255),
    };
};

const smoothstep = (progress: number): number => progress ** 2 * (3 - 2 * progress);

const colorAtLightness = (color: OklchColor, lightness: number): RGBColor => {
    const chromaProgress = lightness >= color.lightness
        ? (1 - lightness) / (1 - color.lightness)
        : lightness / color.lightness;
    const chroma = color.chroma * smoothstep(chromaProgress);
    let minimumChroma = 0;
    let maximumChroma = chroma;
    let result = toRgb({ ...color, lightness, chroma: 0 })!;

    for (let iteration = 0; iteration < 12; iteration += 1) {
        const chroma = (minimumChroma + maximumChroma) / 2;
        const candidate = toRgb({ ...color, lightness, chroma });
        if (candidate) {
            minimumChroma = chroma;
            result = candidate;
        } else {
            maximumChroma = chroma;
        }
    }

    return result;
};

const interpolate = (from: number, to: number, progress: number): number => from + (to - from) * progress;

const createPalette = (middle: RGBColor): ThemeColor => {
    const color = toOklch(middle);
    return {
        50: colorAtLightness(color, neutralPaletteLightness[50]),
        100: colorAtLightness(color, neutralPaletteLightness[100]),
        200: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.25)),
        300: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.5)),
        400: colorAtLightness(color, interpolate(neutralPaletteLightness[100], color.lightness, 0.75)),
        500: middle,
        600: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.28)),
        700: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.6)),
        800: colorAtLightness(color, interpolate(color.lightness, neutralPaletteLightness[900], 0.85)),
        900: colorAtLightness(color, neutralPaletteLightness[900]),
    };
};

const createNeutralPalette = (middle: RGBColor): ThemeColor => {
    const color = toOklch(middle);
    const neutralMiddle = colorAtLightness({ ...color, chroma: Math.min(color.chroma, 0.04) }, color.lightness);
    return createPalette(neutralMiddle);
};

export class Theme {
    public name: string;
    public mode: ThemeMode;
    public isLight: boolean;
    public isDark: boolean;
    public otherMode: ThemeMode;

    private mediaSubscription: { unsubscribe: () => void } | null = null;

    public readonly media$: BehaviorSubject<MediaWithBreakpoints>;

    public readonly sizes = themeSizes;

    public readonly appearancePolicies: Record<SurfaceVariant, ThemeAppearancePolicy>;

    /**
     * Minimum value in pixels from which a breakpoint is active
     */
    public static breakpointThresholds: { [key in Breakpoint]: number } = {
        xxs: 0,
        xs: 480,
        sm: 600,
        md: 768,
        lg: 1024,
        xl: 1280,
        xxl: 1600,
        xxxl: 1920
    };

    public static calculateMedia = ({ windowWidth, ...media }: Media): MediaWithBreakpoints => {
        const breakpoint = (Object.entries(Theme.breakpointThresholds) as [Breakpoint, number][])
            .sort((a, b) => a[1] - b[1])
            .reduce<Breakpoint>((acc, [b, threshold]) => windowWidth > threshold ? b : acc, 'xs');

        return {
            ...media,
            windowWidth,
            breakpoint,
            isXxs: breakpoint === 'xxs',
            isXs: breakpoint === 'xs',
            isSm: breakpoint === 'sm',
            isMd: breakpoint === 'md',
            isLg: breakpoint === 'lg',
            isXl: breakpoint === 'xl',
            isXxl: breakpoint === 'xxl',
            isXxxl: breakpoint === 'xxxl',
            isLessThanSm: windowWidth < Theme.breakpointThresholds.sm,
            isLessThanMd: windowWidth < Theme.breakpointThresholds.md,
            isLessThanLg: windowWidth < Theme.breakpointThresholds.lg,
            isLessThanXl: windowWidth < Theme.breakpointThresholds.xl,
            isLessThanXxl: windowWidth < Theme.breakpointThresholds.xxl,
            isMoreThanXl: windowWidth >= Theme.breakpointThresholds.xxl,
            isMoreThanLg: windowWidth >= Theme.breakpointThresholds.xl,
            isMoreThanMd: windowWidth >= Theme.breakpointThresholds.lg,
            isMoreThanSm: windowWidth >= Theme.breakpointThresholds.md,
            isMoreThanXs: windowWidth >= Theme.breakpointThresholds.sm,
        };
    };

    public statusColors: ThemeStatusColors;

    public static palette: { [key in PaletteColor]: ThemeColor } = {
        'neutral-grey': createNeutralPalette({ r: 113, g: 118, b: 117 }),
        'neutral-brown': createNeutralPalette({ r: 128, g: 108, b: 91 }),
        'neutral-khaki': createNeutralPalette({ r: 125, g: 116, b: 82 }),
        'neutral-olive': createNeutralPalette({ r: 122, g: 122, b: 98 }),
        'neutral-green': createNeutralPalette({ r: 108, g: 127, b: 113 }),
        'neutral-teal': createNeutralPalette({ r: 99, g: 128, b: 121 }),
        'neutral-cyan': createNeutralPalette({ r: 103, g: 130, b: 136 }),
        'neutral-blue': createNeutralPalette({ r: 100, g: 108, b: 135 }),
        'neutral-violet': createNeutralPalette({ r: 116, g: 105, b: 137 }),
        'neutral-pink': createNeutralPalette({ r: 133, g: 106, b: 116 }),
        'neutral-red': createNeutralPalette({ r: 132, g: 111, b: 112 }),

        mahogany: createPalette({ r: 148, g: 57, b: 52 }),
        'burnt-orange': createPalette({ r: 184, g: 68, b: 65 }),
        coral: createPalette({ r: 213, g: 94, b: 77 }),
        peach: createPalette({ r: 203, g: 98, b: 52 }),
        orange: createPalette({ r: 240, g: 123, b: 0 }),
        copper: createPalette({ r: 205, g: 127, b: 50 }),
        'warm-brown': createPalette({ r: 145, g: 88, b: 52 }),
        yellow: createPalette({ r: 220, g: 166, b: 0 }),
        'luminous-yellow': createPalette({ r: 222, g: 209, b: 49 }),
        'dark-gold': createPalette({ r: 148, g: 131, b: 51 }),
        chartreuse: createPalette({ r: 168, g: 171, b: 12 }),
        lime: createPalette({ r: 108, g: 125, b: 0 }),
        green: createPalette({ r: 26, g: 104, b: 64 }),
        mint: createPalette({ r: 19, g: 145, b: 93 }),
        teal: createPalette({ r: 14, g: 128, b: 127 }),
        aqua: createPalette({ r: 12, g: 145, b: 143 }),
        cyan: createPalette({ r: 0, g: 153, b: 173 }),
        navy: createPalette({ r: 47, g: 91, b: 125 }),
        blue: createPalette({ r: 75, g: 115, b: 255 }),
        indigo: createPalette({ r: 91, g: 73, b: 190 }),
        violet: createPalette({ r: 91, g: 63, b: 125 }),
        'deep-violet': createPalette({ r: 82, g: 62, b: 135 }),
        purple: createPalette({ r: 170, g: 50, b: 250 }),
        plum: createPalette({ r: 154, g: 71, b: 151 }),
        magenta: createPalette({ r: 187, g: 62, b: 187 }),
        pink: createPalette({ r: 205, g: 145, b: 205 }),
        rose: createPalette({ r: 220, g: 52, b: 94 }),
        red: createPalette({ r: 235, g: 0, b: 53 }),
    }

    public colors: { [key in PaletteColor | ColorVariant]: ThemeColor };

    public static spacing: { [key in SpacingVariant]: string } = {
        xs: '6px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    }

    public static layers: Record<ThemeLayer, ThemeLayerPolicy> = {
        'hud-connector': {
            zIndex: 2,
            elevation: 'none'
        },
        popup: {
            zIndex: 1000,
            elevation: 'overlay'
        },
        floating: {
            zIndex: 1100,
            elevation: 'floating'
        },
        dialog: {
            zIndex: 5000,
            elevation: 'overlay'
        },
        dropdown: {
            zIndex: 6000,
            elevation: 'overlay'
        },
        'tooltip-connector': {
            zIndex: 9998,
            elevation: 'none'
        },
        tooltip: {
            zIndex: 10000,
            elevation: 'floating'
        },
    } as const;

    public elevations: Record<ElevationLevel, ThemeElevation>;

    public static properties = {
        disabledOpacity: 0.4,
    }

    public constructor(
        specification: ThemeSpecification,
        protected media: MediaSubscriptionDefinition
    ) {
        this.mode = specification.mode;
        this.isLight = specification.mode === 'light';
        this.isDark = specification.mode === 'dark';
        this.otherMode = specification.mode === 'light' ? 'dark' : 'light';
        this.name = specification.themeName;
        this.elevations = elevations[this.mode];
        this.statusColors = specification.statusColors;
        const statusPalettes = Object.fromEntries(
            Object.entries(this.statusColors).map(([status, selected]) => [
                status,
                Theme.palette[selected.name as PaletteColor]
                ?? specification.colors[selected.name as DesignSystemColor],
            ]),
        ) as Record<StatusColor, ThemeColor>;
        this.colors = Object.assign({}, Theme.palette, specification.colors, statusPalettes);
        const shades: ThemeVariantShades = this.isLight
            ? {
                base: 500,
                brightest: 50,
                content: 900,
                inverseSurface: 200,
                insetSurface: 100,
                interaction: 600,
                active: 700,
                disabledSurface: 200,
                disabledContent: 300,
            }
            : {
                base: 500,
                brightest: 50,
                content: 100,
                inverseSurface: 800,
                insetSurface: 900,
                interaction: 300,
                active: 200,
                disabledSurface: 800,
                disabledContent: 700,
            };
        const transparent: ThemeAppearancePaint = {
            type: 'transparent',
        };
        const transparentBorder: ThemeAppearanceBorder = {
            type: 'transparent',
            width: 0,
        };
        const disabledContent: ThemeAppearancePaint = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledContent,
        };
        const disabledSurface: ThemeAppearancePaint = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledSurface,
        };
        const disabledContentBorder: ThemeAppearanceBorder = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledContent,
            width: 1,
        };
        const insetEffect = (
            colorProperty: 'color' | 'highlightColor',
        ): ThemeAppearanceInsetEffectPolicy => this.isLight
                ? {
                    edgeStart: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.content,
                        opacity: 0.2,
                    },
                    edgeEnd: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.brightest,
                        opacity: 0.7,
                    },
                    shadow: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.content,
                        opacity: 0.2,
                    },
                    highlight: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.brightest,
                        opacity: 0.7,
                    },
                    recess: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.content,
                        opacity: 0.08,
                    },
                    shadowOpacity: 0.35,
                    highlightOpacity: 0.45,
                }
                : {
                    edgeStart: transparent,
                    edgeEnd: transparent,
                    shadow: {
                        type: 'literal',
                        value: 'rgba(0, 0, 0, 0.8)',
                    },
                    highlight: {
                        type: 'literal',
                        value: 'rgba(255, 255, 255, 0.08)',
                    },
                    recess: {
                        type: 'literal',
                        value: 'rgba(0, 0, 0, 0.18)',
                    },
                    shadowOpacity: 0.65,
                    highlightOpacity: 0.12,
                };
        const policies: Record<SurfaceVariant, ThemeAppearancePolicy> = {
            ghost: {
                states: {
                    default: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                        },
                    },
                    interaction: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                        },
                    },
                    active: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                        },
                    },
                    disabled: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'none',
                    glyphsGlow: true,
                },
            },
            fill: {
                states: {
                    default: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'color',
                            backgroundShade: shades.base,
                        },
                    },
                    interaction: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                            backgroundShade: shades.interaction,
                        },
                    },
                    active: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                            backgroundShade: shades.active,
                        },
                    },
                    disabled: {
                        surface: disabledSurface,
                        border: transparentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'none',
                    glyphsGlow: false,
                },
            },
            'fill-inverse': {
                states: {
                    default: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.inverseSurface,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.content,
                        },
                    },
                    interaction: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.inverseSurface,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.content,
                        },
                    },
                    active: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.inverseSurface,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.content,
                        },
                    },
                    disabled: {
                        surface: disabledSurface,
                        border: disabledContentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'none',
                    glyphsGlow: false,
                },
            },
            'fill-translucent': {
                states: {
                    default: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: 0.24,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: 0.3,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                        },
                    },
                    interaction: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: 0.24,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                        },
                    },
                    active: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: 0.24,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                        },
                    },
                    disabled: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.disabledSurface,
                            opacity: 0.24,
                        },
                        border: disabledContentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 6,
                    depth: 'none',
                    glyphsGlow: false,
                },
            },
            outline: {
                states: {
                    default: {
                        surface: transparent,
                        border: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                        },
                    },
                    interaction: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.base,
                            opacity: 0.08,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                        },
                    },
                    active: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.base,
                            opacity: 0.16,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                        },
                    },
                    disabled: {
                        surface: transparent,
                        border: disabledContentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'none',
                    glyphsGlow: true,
                },
            },
            inset: {
                states: {
                    default: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                        },
                    },
                    interaction: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.interaction,
                        },
                    },
                    active: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.active,
                        },
                    },
                    disabled: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: disabledContent,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'inset',
                    glyphsGlow: true,
                    inset: {
                        default: insetEffect('color'),
                        interaction: insetEffect('highlightColor'),
                        active: insetEffect('highlightColor'),
                        disabled: insetEffect('color'),
                    },
                },
            },
        };
        this.appearancePolicies = policies;
        this.media$ = new BehaviorSubject<MediaWithBreakpoints>(Theme.calculateMedia(media.initial()));
        this.mediaSubscription = this.subscribeMedia();
    }

    private subscribeMedia = (): { unsubscribe: () => void } => {
        return this.media.subscribe((m) => {
            this.media$.next(Theme.calculateMedia(m));
        });
    }

    public destroy = () => {
        this.mediaSubscription?.unsubscribe();
    };

    /**
     * Returns an rgb or rgba color string.
     * @param name 
     * @param shade Optional. One of `50,100,200,...,900`. Defaults to the configured status shade or 500.
     * @param opacity Optional value `[0,1]`. If not provided will be rgb(r, g, b), otherwise rgba(r, g, b, opacity)
     * @returns 
     */
    public color = (
        name: PaletteColor | ColorVariant,
        shade?: ColorShade,
        opacity?: number,
    ): string => {
        const resolvedShade = shade ?? this.statusColors[name as StatusColor]?.shade ?? 500;
        const { r, g, b } = this.colors[name][resolvedShade];

        if (opacity === undefined) {
            return `rgb(${r}, ${g}, ${b})`;
        }

        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    public surfaceColor = (
        role: ThemeSurfaceColorRole,
        opacity?: number,
    ): string => {
        const shades: { [key in ThemeSurfaceColorRole]: ColorShade } = this.isLight
            ? {
                background: 100,
                border: 200,
                content: 900,
            }
            : {
                background: 900,
                border: 800,
                content: 100,
            };
        return this.color('neutral', shades[role], opacity);
    };

    public contrastShade = (
        name: PaletteColor | ColorVariant,
        backgroundShade?: ColorShade,
    ): 100 | 900 => Theme.contrastShade(
        this.colors[name],
        backgroundShade ?? this.statusColors[name as StatusColor]?.shade ?? 500,
    );

    public static contrastShade = (
        color: ThemeColor,
        backgroundShade: ColorShade = 500,
    ): 100 | 900 => toOklch(color[backgroundShade]).lightness < fillContrastLightnessThreshold
            ? 100
            : 900;

    public resolveAppearance = (
        variant: SurfaceVariant,
        baseColor: PaletteColor | ColorVariant,
        highlightColor: PaletteColor | ColorVariant,
        state: ThemeAppearanceState,
    ): ResolvedThemeAppearance => {
        const policy = this.appearancePolicies[variant];
        const resolve = (paint: ThemeAppearancePaint): string => {
            if (paint.type === 'transparent') {
                return 'transparent';
            }
            if (paint.type === 'literal') {
                return paint.value;
            }
            const name = paint.colorProperty === 'color' ? baseColor : highlightColor;
            const shade = paint.type === 'contrast'
                ? this.contrastShade(name, paint.backgroundShade)
                : paint.shade;
            return this.color(name, shade, paint.opacity);
        };
        const resolved = policy.states[state];
        const insetPolicy = policy.effects.inset?.[state];
        const inset: ThemeAppearanceInsetEffect = insetPolicy
            ? {
                edgeStart: resolve(insetPolicy.edgeStart),
                edgeEnd: resolve(insetPolicy.edgeEnd),
                shadow: resolve(insetPolicy.shadow),
                highlight: resolve(insetPolicy.highlight),
                recess: resolve(insetPolicy.recess),
                shadowOpacity: insetPolicy.shadowOpacity,
                highlightOpacity: insetPolicy.highlightOpacity,
            }
            : {
                edgeStart: 'transparent',
                edgeEnd: 'transparent',
                shadow: 'transparent',
                highlight: 'transparent',
                recess: 'transparent',
                shadowOpacity: 0,
                highlightOpacity: 0,
            };

        return {
            surface: resolve(resolved.surface),
            border: {
                color: resolve(resolved.border),
                width: resolved.border.width,
            },
            glyphs: resolve(resolved.glyphs),
            effects: {
                ...policy.effects,
                glowColor: this.color(highlightColor),
                inset,
            },
        };
    };

    /**
     * Returns a css color string from the current theme.
     */
    /**
     * Resolves an elevation level to platform-neutral shadow metrics.
     * Direction describes where the shadow is cast; a bottom panel therefore uses `up`.
     *
     * Levels:
     * - `none`: ordinary content and connectors without surface elevation.
     * - `raised`: persistent top bars, toolbars, and side or bottom panels.
     * - `floating`: transient notices, tool widgets, and tooltips.
     * - `overlay`: popups, menus, dropdowns, and dialogs.
     *
     * @param level Visual depth independent from z-index.
     * @param direction Direction in which the shadow is cast. Defaults to `down`.
     *
     * @example
     * const widgetElevation = theme.elevation('floating');
     * @example
     * const rightPanelElevation = theme.elevation('raised', 'left');
     * @example
     * const bottomPanelElevation = theme.elevation('raised', 'up');
     */
    public elevation = (
        level: ElevationLevel,
        direction: ElevationDirection = 'down',
    ): ResolvedThemeElevation => {
        const elevation = this.elevations[level];
        const offset = {
            up: {
                x: 0,
                y: -elevation.distance
            },
            right: {
                x: elevation.distance,
                y: 0
            },
            down: {
                x: 0,
                y: elevation.distance
            },
            left: {
                x: -elevation.distance,
                y: 0
            },
        }[direction];

        return {
            color: 'rgb(0, 0, 0)',
            offset,
            blur: elevation.blur,
            opacity: elevation.opacity,
            depth: elevation.depth,
        };
    };

    /**
     * Resolves a global stacking layer and its assigned elevation together.
     * Use this instead of selecting a layer z-index and elevation independently.
     *
     * @param name Global layer role.
     * @param direction Direction in which the layer shadow is cast. Defaults to `down`.
     *
     * @example
     * const popupLayer = theme.layer('popup');
     */
    public layer = (
        name: ThemeLayer,
        direction: ElevationDirection = 'down',
    ): ResolvedThemeLayer => {
        const policy = Theme.layers[name];
        return {
            zIndex: policy.zIndex,
            elevation: this.elevation(policy.elevation, direction),
        };
    };

}

import { BehaviorSubject } from 'rxjs';
import {
    Breakpoint,
    Media,
    MediaSubscriptionDefinition,
    MediaWithBreakpoints,
    PaletteColor,
    ThemeColor,
    ThemeStatusColors,
    ThemeSpecification,
    ThemeMode,
    ThemeAppearancePaint,
    ThemeAppearancePolicy,
    ThemeAppearanceInsetEffect,
    ThemeAppearanceInsetEffectPolicy,
    ThemeVariantShades,
    ResolvedThemeAppearance,
    ThemeAppearanceState,
    ThemeAppearanceVariant,
    ThemeAppearanceStatePolicy,
    ThemeAppearanceBorder,
    ThemeAppearanceGlyphs,
    ElevationDirection,
    ElevationLevel,
    ResolvedThemeElevation,
    ResolvedThemeLayer,
    ThemeElevation,
    ElevationLayer,
    ThemeLayerPolicy,
} from "./model";
import { ColorShade, ColorVariant, DesignSystemColor, SpacingVariant, StatusColor, SurfaceVariant } from '../model';
import { DEFAULT_COLOR, translucentSurfaceOpacity } from '../tinkers';
import { palette, resolveContrastShade } from './palette';
import {
    elevationSpecifications,
    themeBreakpointThresholds,
    themeLayers,
    themeProperties,
    themeSizes,
    themeSpacing,
} from './tinkers';

export class Theme {
    public name: string;
    public mode: ThemeMode;
    public isLight: boolean;
    public isDark: boolean;
    public otherMode: ThemeMode;

    private mediaSubscription: { unsubscribe: () => void } | null = null;
    private modeThemes = new Map<ThemeMode, Theme>();

    public readonly media$: BehaviorSubject<MediaWithBreakpoints>;

    public readonly sizes = themeSizes;

    public readonly appearancePolicies: Record<ThemeAppearanceVariant, ThemeAppearancePolicy>;

    /**
     * Minimum value in pixels from which a breakpoint is active
     */
    public static breakpointThresholds: { [key in Breakpoint]: number } = themeBreakpointThresholds;

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

    public static palette: { [key in PaletteColor]: ThemeColor } = palette;

    public colors: { [key in PaletteColor | ColorVariant]: ThemeColor };

    public static resolveColors(
        specification: ThemeSpecification,
    ): Record<PaletteColor | ColorVariant, ThemeColor> {
        const statusPalettes = Object.fromEntries(
            Object.entries(specification.statusColors).map(([status, selected]) => [
                status,
                Theme.palette[selected.name as PaletteColor]
                ?? specification.colors[selected.name as DesignSystemColor],
            ]),
        ) as Record<StatusColor, ThemeColor>;
        return {
            ...Theme.palette,
            ...specification.colors,
            ...statusPalettes,
        };
    }

    public static spacing: { [key in SpacingVariant]: string } = themeSpacing;

    public static layers: Record<ElevationLayer, ThemeLayerPolicy> = themeLayers;

    public elevations: Record<ElevationLevel, ThemeElevation>;

    public static properties = themeProperties;

    public constructor(
        private readonly specification: ThemeSpecification,
        protected media: MediaSubscriptionDefinition,
        private readonly supportsBackdropBlur = true,
    ) {
        this.mode = specification.mode;
        this.modeThemes.set(this.mode, this);
        this.isLight = specification.mode === 'light';
        this.isDark = specification.mode === 'dark';
        this.otherMode = specification.mode === 'light' ? 'dark' : 'light';
        this.name = specification.themeName;
        this.elevations = elevationSpecifications[this.mode];
        this.statusColors = specification.statusColors;
        this.colors = Theme.resolveColors(specification);
        const translucentOpacity = supportsBackdropBlur
            ? translucentSurfaceOpacity.blurred
            : translucentSurfaceOpacity.unblurred;
        const shades: ThemeVariantShades = this.isLight
            ? {
                base: 500,
                brightest: 50,
                surface: 100,
                border: 200,
                glyphs: 900,
                inverseSurface: 200,
                insetSurface: 100,
                hoverFocus: 600,
                activePressed: 700,
                disabledSurface: 200,
                disabledGlyphs: 300,
            }
            : {
                base: 500,
                brightest: 50,
                surface: 900,
                border: 800,
                glyphs: 100,
                inverseSurface: 800,
                insetSurface: 900,
                hoverFocus: 300,
                activePressed: 200,
                disabledSurface: 800,
                disabledGlyphs: 700,
            };
        const transparent: ThemeAppearancePaint = {
            type: 'transparent',
        };
        const transparentBorder: ThemeAppearanceBorder = {
            type: 'transparent',
            width: 0,
        };
        const translucentGlyphs: ThemeAppearanceGlyphs = {
            type: 'shade',
            colorProperty: 'color',
            shade: this.isLight ? 900 : 100,
        };
        const disabledGlyphs: ThemeAppearancePaint = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledGlyphs,
        };
        const disabledSurface: ThemeAppearancePaint = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledSurface,
        };
        const disabledGlyphsBorder: ThemeAppearanceBorder = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.disabledGlyphs,
            width: 1,
        };
        const insetEffect = (
            colorProperty: 'color' | 'highlightColor',
        ): ThemeAppearanceInsetEffectPolicy => this.isLight
                ? {
                    edgeStart: {
                        type: 'shade',
                        colorProperty,
                        shade: shades.glyphs,
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
                        shade: shades.glyphs,
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
                        shade: shades.glyphs,
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
        const defaultStateSurface: ThemeAppearanceStatePolicy['surface'] = {
            type: 'shade',
            colorProperty: 'color',
            shade: shades.surface,
        };
        const policies: Record<SurfaceVariant, ThemeAppearancePolicy> & {
            default: ThemeAppearancePolicy;
        } = {
            default: {
                states: {
                    default: {
                        surface: defaultStateSurface,
                        border: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.border,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.glyphs,
                        },
                    },
                    'hover-focus': {
                        surface: defaultStateSurface,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                        },
                    },
                    'active-pressed': {
                        surface: defaultStateSurface,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                        },
                    },
                    disabled: {
                        surface: disabledSurface,
                        border: disabledGlyphsBorder,
                        glyphs: disabledGlyphs,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'none',
                    glyphsGlow: false,
                },
            },
            ghost: {
                states: {
                    default: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: this.isLight ? 700 : 300,
                            fontWeight: 500,
                        },
                    },
                    'hover-focus': {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: this.isLight ? 800 : 200,
                            fontWeight: 500,
                        },
                    },
                    'active-pressed': {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.glyphs,
                            fontWeight: 500,
                        },
                    },
                    disabled: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: {
                            ...disabledGlyphs,
                            fontWeight: 500,
                        },
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
                        },
                    },
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                        },
                    },
                    disabled: {
                        surface: disabledSurface,
                        border: transparentBorder,
                        glyphs: disabledGlyphs,
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
                            shade: shades.glyphs,
                        },
                    },
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.inverseSurface,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.glyphs,
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.inverseSurface,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.glyphs,
                        },
                    },
                    disabled: {
                        surface: disabledSurface,
                        border: disabledGlyphsBorder,
                        glyphs: disabledGlyphs,
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
                            opacity: translucentOpacity,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: 0.3,
                            width: 1,
                        },
                        glyphs: translucentGlyphs,
                    },
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: translucentOpacity,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                            width: 1,
                        },
                        glyphs: {
                            ...translucentGlyphs,
                            colorProperty: 'highlightColor',
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.base,
                            opacity: translucentOpacity,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                            width: 1,
                        },
                        glyphs: {
                            ...translucentGlyphs,
                            colorProperty: 'highlightColor',
                        },
                    },
                    disabled: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.disabledSurface,
                            opacity: translucentOpacity,
                        },
                        border: disabledGlyphsBorder,
                        glyphs: disabledGlyphs,
                    },
                },
                effects: {
                    backdropBlur: supportsBackdropBlur ? 6 : 0,
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
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.base,
                            opacity: 0.08,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.hoverFocus,
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.base,
                            opacity: 0.16,
                        },
                        border: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                            width: 1,
                        },
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.activePressed,
                        },
                    },
                    disabled: {
                        surface: transparent,
                        border: disabledGlyphsBorder,
                        glyphs: disabledGlyphs,
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
                            shade: this.isLight ? 700 : 300,
                        },
                    },
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: this.isLight ? 800 : 200,
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: shades.glyphs,
                        },
                    },
                    disabled: {
                        surface: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: shades.insetSurface,
                        },
                        border: transparentBorder,
                        glyphs: disabledGlyphs,
                    },
                },
                effects: {
                    backdropBlur: 0,
                    depth: 'inset',
                    glyphsGlow: true,
                    inset: {
                        default: insetEffect('color'),
                        'hover-focus': insetEffect('highlightColor'),
                        'active-pressed': insetEffect('highlightColor'),
                        disabled: insetEffect('color'),
                    },
                },
            },
        };
        const menuHoverShade: ColorShade = this.isLight ? 300 : 700;
        const menuPressedShade: ColorShade = this.isLight ? 400 : 600;

        this.appearancePolicies = {
            ...policies,
            'menu-item': {
                states: {
                    default: {
                        ...policies.ghost.states.default,
                        glyphs: {
                            type: 'shade',
                            colorProperty: 'color',
                            shade: this.isLight ? 800 : 200,
                        },
                    },
                    'hover-focus': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: menuHoverShade,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                        },
                    },
                    'active-pressed': {
                        surface: {
                            type: 'shade',
                            colorProperty: 'highlightColor',
                            shade: menuPressedShade,
                        },
                        border: transparentBorder,
                        glyphs: {
                            type: 'contrast',
                            colorProperty: 'highlightColor',
                        },
                    },
                    disabled: {
                        surface: transparent,
                        border: transparentBorder,
                        glyphs: disabledGlyphs,
                    },
                },
                effects: policies.fill.effects,
            },
        };
        this.media$ = new BehaviorSubject<MediaWithBreakpoints>(Theme.calculateMedia(media.initial()));
        this.mediaSubscription = this.subscribeMedia();
    }

    private subscribeMedia = (): { unsubscribe: () => void } => {
        return this.media.subscribe((m) => {
            this.media$.next(Theme.calculateMedia(m));
        });
    }

    public forMode = (mode: ThemeMode = this.mode): Theme => {
        if (mode === this.mode) {
            return this;
        }
        let theme = this.modeThemes.get(mode);
        if (!theme) {
            theme = new Theme(
                {
                    ...this.specification,
                    mode,
                },
                this.media,
                this.supportsBackdropBlur,
            );
            theme.modeThemes = this.modeThemes;
            this.modeThemes.set(mode, theme);
        }
        return theme;
    };

    public destroy = () => {
        this.modeThemes.forEach((theme) => {
            theme.mediaSubscription?.unsubscribe();
            theme.mediaSubscription = null;
        });
        this.modeThemes.clear();
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

    public contrastShade = (
        name: PaletteColor | ColorVariant,
        backgroundShade?: ColorShade,
    ): 100 | 900 => Theme.contrastShade(
        this.colors[name],
        backgroundShade ?? this.statusColors[name as StatusColor]?.shade ?? 500,
    );

    public static contrastShade = resolveContrastShade;

    public resolveAppearance = (
        variant?: ThemeAppearanceVariant,
        baseColor: PaletteColor | ColorVariant = DEFAULT_COLOR,
        highlightColor: PaletteColor | ColorVariant = baseColor,
        state: ThemeAppearanceState = 'default',
    ): ResolvedThemeAppearance => {
        const policy = this.appearancePolicies[variant ?? 'default'];
        const resolved = policy.states[state];
        const resolve = (paint: ThemeAppearancePaint): string => {
            if (paint.type === 'transparent') {
                return 'transparent';
            }
            if (paint.type === 'literal') {
                return paint.value;
            }
            const name = paint.colorProperty === 'color' ? baseColor : highlightColor;
            let shade: ColorShade;
            if (paint.type === 'contrast') {
                if (resolved.surface.type !== 'shade') {
                    throw new Error('Contrast paint requires a shaded surface.');
                }
                shade = this.contrastShade(name, resolved.surface.shade);
            } else {
                shade = paint.shade;
            }
            return this.color(name, shade, paint.opacity);
        };
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
            fontWeight: resolved.glyphs.fontWeight,
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
        name: ElevationLayer,
        direction: ElevationDirection = 'down',
    ): ResolvedThemeLayer => {
        const policy = Theme.layers[name];
        return {
            zIndex: policy.zIndex,
            elevation: this.elevation(policy.elevation, direction),
        };
    };

}

import type { ColorShade, DesignSystemColor, SizeVariant, StatusColor, SurfaceVariant } from '../model';
import type { FontWeight } from '../typography/model';

export enum ThemeName {
    Default = 'Default',
    NeonBlue = 'Neon Blue',
    Batman = 'Batman',
    Joker = 'Joker',
    Foundry = 'Foundry',
    Aurora = 'Aurora',
    SolarFlare = 'Solar Flare',
    Verdant = 'Verdant',
    GoldenCircuit = 'Golden Circuit',
}

export type ThemeColor = {
    [key in ColorShade]: RGBColor;
};

export type PaletteColor =
    | 'neutral-grey'
    | 'neutral-blue'
    | 'neutral-brown'
    | 'neutral-khaki'
    | 'neutral-green'
    | 'neutral-olive'
    | 'neutral-teal'
    | 'neutral-cyan'
    | 'neutral-pink'
    | 'neutral-violet'
    | 'neutral-red'
    | 'yellow'
    | 'coral'
    | 'chartreuse'
    | 'luminous-yellow'
    | 'copper'
    | 'peach'
    | 'warm-brown'
    | 'dark-gold'
    | 'mahogany'
    | 'teal'
    | 'cyan'
    | 'aqua'
    | 'magenta'
    | 'pink'
    | 'rose'
    | 'blue'
    | 'navy'
    | 'burnt-orange'
    | 'orange'
    | 'red'
    | 'purple'
    | 'violet'
    | 'plum'
    | 'indigo'
    | 'deep-violet'
    | 'lime'
    | 'mint'
    | 'green';

export interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export interface SelectedColor {
    name: DesignSystemColor | PaletteColor;
    /**
     * Defaults to `500`.
     */
    shade?: ColorShade;
}

export type ThemeStatusColors = {
    [key in StatusColor]: SelectedColor;
};

export type ThemeAppearanceState = 'default' | 'hover-focus' | 'active-pressed' | 'disabled';

export type ThemeAppearanceVariant = SurfaceVariant | 'default' | 'menu-item';

export interface ThemeAppearancePaintTransparent {
    type: 'transparent';
}

export interface ThemeAppearancePaintShade {
    type: 'shade';
    colorProperty: 'color' | 'highlightColor';
    shade: ColorShade;
    opacity?: number;
}

export interface ThemeAppearancePaintContrast {
    type: 'contrast';
    colorProperty: 'color' | 'highlightColor';
    opacity?: number;
}

export interface ThemeAppearancePaintLiteral {
    type: 'literal';
    value: string;
}

export type ThemeAppearancePaint =
    | ThemeAppearancePaintTransparent
    | ThemeAppearancePaintShade
    | ThemeAppearancePaintContrast
    | ThemeAppearancePaintLiteral;

export type ThemeAppearanceBorder = ThemeAppearancePaint & { width: number };

export type ThemeAppearanceGlyphs = ThemeAppearancePaint & {
    fontWeight?: FontWeight;
};

export interface ThemeAppearanceStatePolicy {
    surface: ThemeAppearancePaint;
    border: ThemeAppearanceBorder;
    glyphs: ThemeAppearanceGlyphs;
}

export interface ThemeAppearancePolicy {
    states: Record<ThemeAppearanceState, ThemeAppearanceStatePolicy>;
    effects: {
        backdropBlur: number;
        depth: 'none' | 'inset';
        glyphsGlow: boolean;
        inset?: Record<ThemeAppearanceState, ThemeAppearanceInsetEffectPolicy>;
    };
}

export interface ThemeAppearanceInsetEffectPolicy {
    edgeStart: ThemeAppearancePaint;
    edgeEnd: ThemeAppearancePaint;
    shadow: ThemeAppearancePaint;
    highlight: ThemeAppearancePaint;
    recess: ThemeAppearancePaint;
    shadowOpacity: number;
    highlightOpacity: number;
}

export interface ThemeVariantShades {
    base: ColorShade;
    brightest: ColorShade;
    surface: ColorShade;
    border: ColorShade;
    glyphs: ColorShade;
    inverseSurface: ColorShade;
    insetSurface: ColorShade;
    hoverFocus: ColorShade;
    activePressed: ColorShade;
    disabledSurface: ColorShade;
    disabledGlyphs: ColorShade;
}

export interface ThemeAppearanceEffects {
    backdropBlur: number;
    depth: 'none' | 'inset';
    glyphsGlow: boolean;
    glowColor: string;
    inset: ThemeAppearanceInsetEffect;
}

export interface ThemeAppearanceInsetEffect {
    edgeStart: string;
    edgeEnd: string;
    shadow: string;
    highlight: string;
    recess: string;
    shadowOpacity: number;
    highlightOpacity: number;
}

export interface ResolvedThemeAppearanceBorder {
    color: string;
    width: number;
}

export interface ResolvedThemeAppearance {
    surface: string;
    border: ResolvedThemeAppearanceBorder;
    glyphs: string;
    fontWeight?: FontWeight;
    effects: ThemeAppearanceEffects;
}

export interface ThemeControlSize {
    height: number;
    fontSize: number;
    iconSize: number;
    gap: number;
    paddingInline: number;
    paddingBlock: number;
    iconPaddingInline: number;
}

export interface ThemeSizes {
    control: Record<SizeVariant, ThemeControlSize>;
}

export type ElevationLevel = 'none' | 'raised' | 'floating' | 'overlay';

export type ElevationDirection = 'up' | 'right' | 'down' | 'left';

export interface ThemeElevation {
    distance: number;
    blur: number;
    opacity: number;
    depth: number;
}

export interface ResolvedThemeElevation {
    color: string;
    offset: {
        x: number;
        y: number;
    };
    blur: number;
    opacity: number;
    depth: number;
}

export type ElevationLayer =
    | 'hud-connector'
    | 'popup'
    | 'floating'
    | 'dialog'
    | 'dropdown'
    | 'tooltip-connector'
    | 'tooltip';

export interface ThemeLayerPolicy {
    zIndex: number;
    elevation: ElevationLevel;
}

export interface ResolvedThemeLayer {
    zIndex: number;
    elevation: ResolvedThemeElevation;
}

export interface ThemeSpecification {
    mode: ThemeMode;
    themeName: ThemeName;
    colors: {
        [key in DesignSystemColor]: ThemeColor;
    };
    statusColors: ThemeStatusColors;
}

export type ThemeMode = 'light' | 'dark';

export type Breakpoint =
    'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export enum Orientation {
    Portrait,
    Landscape,
}

export interface Media {
    orientation: Orientation;
    windowWidth: number;
    windowHeight: number;
}

export interface MediaWithBreakpoints extends Media {
    breakpoint: Breakpoint;
    isXxs: boolean;
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    isXxl: boolean;
    isXxxl: boolean;
    isLessThanSm: boolean;
    isLessThanMd: boolean;
    isLessThanLg: boolean;
    isLessThanXl: boolean;
    isLessThanXxl: boolean;
    isMoreThanXl: boolean;
    isMoreThanLg: boolean;
    isMoreThanMd: boolean;
    isMoreThanSm: boolean;
    isMoreThanXs: boolean;
}

export interface MediaSubscriptionDefinition {
    initial: () => Media;
    subscribe: (onChange: (media: Media) => void) => {
        unsubscribe: () => void;
    };
}

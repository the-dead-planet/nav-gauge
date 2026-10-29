import type { ThemeMode } from './theme/model';

export type ActiveGlow = 'none' | 'glow' | 'animate-borders-glow';

export type DesignSystemColor =
    'primary' | 'secondary' | 'tertiary' | 'neutral';

export type StatusColor = 'glitch' | 'hazard' | 'secured' | 'intel';

export type ColorVariant = DesignSystemColor | StatusColor;

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FillVariant = 'fill' | 'fill-inverse' | 'fill-translucent';

export type SurfaceVariant = FillVariant | 'ghost' | 'outline' | 'inset';

export interface ActionButtonVariants {
    active: SurfaceVariant;
    inactive: SurfaceVariant;
}

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg';

export type SpacingVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type CornerVariant = 'square' | 'circle' | 'hexagon';

export interface AppearancePropsBase<TVariant extends SurfaceVariant = SurfaceVariant> {
    themeMode?: ThemeMode;
    variant?: TVariant;
    color?: ColorVariant;
    /** Applied on hovered, focused, pressed and highlighted states. */
    highlightColor?: ColorVariant;
    /** Persistent visual emphasis, distinct from a temporary press. */
    highlighted?: boolean;
    disabled?: boolean;
}

export interface AppearanceProps<TVariant extends SurfaceVariant = SurfaceVariant> extends AppearancePropsBase<TVariant> {
    size?: SizeVariant;
    /**
     * Has impact on content such as text and icons.
     */
    glyphsShade?: ColorShade;
    /**
     * Applied on hovered, focused, pressed and highlighted states.
     * Has impact on content such as text and icons.
     */
    highlightGlyphsShade?: ColorShade;
}

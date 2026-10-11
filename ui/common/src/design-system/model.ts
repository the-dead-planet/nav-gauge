export type ActiveGlow = 'none' | 'glow' | 'animate-borders-glow';

export type DesignSystemColor =
    'primary' | 'secondary' | 'tertiary' | 'neutral';

export type ColorVariant = DesignSystemColor;

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FillVariant = 'fill' | 'fill-inverse' | 'fill-translucent';

export type SurfaceVariant = FillVariant | 'ghost' | 'outline' | 'inset';

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg';

export type SpacingVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AppearancePropsBase<TVariant extends SurfaceVariant = SurfaceVariant> {
    variant?: TVariant;
    color?: ColorVariant;
    /** Applied on hovered, focused and active states. */
    highlightColor?: ColorVariant;
    active?: boolean;
    disabled?: boolean;
}

export interface AppearanceProps<TVariant extends SurfaceVariant = SurfaceVariant> extends AppearancePropsBase<TVariant> {
    size?: SizeVariant;
    /**
     * Has impact on content such as text and icons.
     */
    contentShade?: ColorShade;
    /**
     * Applied on hovered, focused and active states.
     * Has impact on content such as text and icons.
     */
    highlightContentShade?: ColorShade;
}

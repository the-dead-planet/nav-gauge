export interface Option<T> {
    value: T;
    label: string;
}

export type GlowStyle = 'none' | 'glow' | 'animate-borders-glow';
export type SurfaceFillVariant = 'fill' | 'fill-inverse' | 'fill-translucent';
export type SurfaceVariant = SurfaceFillVariant | 'ghost' | 'outline' | 'inset';
export type ColorVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral';
export type SizeVariant = 'xs' | 'sm' | 'md';
export type SpacingVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';

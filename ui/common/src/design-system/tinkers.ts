import { ActiveGlow, ColorVariant, FillVariant, SizeVariant, SurfaceVariant } from './model';
import type { ThemeAppearanceState } from './theme/model';

export const colorOptions: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
export const sizeOptions: SizeVariant[] = ['xs', 'sm', 'md', 'lg'];
export const fillVariantOptions: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];
export const surfaceVariantOptions: SurfaceVariant[] = [
    'ghost',
    'fill',
    'fill-inverse',
    'fill-translucent',
    'outline',
    'inset',
];
export const activeGlowOptions: ActiveGlow[] = ['none', 'glow', 'animate-borders-glow'];
export const themeAppearanceStateOptions: ThemeAppearanceState[] = [
    'default',
    'interaction',
    'active',
    'disabled',
];

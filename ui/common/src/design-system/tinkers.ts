import type { ElevationDirection, ElevationLevel } from './theme/model';
import { ActiveGlow, ColorVariant, FillVariant, SizeVariant, SurfaceVariant } from './model';
import type { ThemeAppearanceState } from './theme/model';

export const colorOptions: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const appearanceColorOptions: ColorVariant[] = [
    ...colorOptions,
    'glitch',
    'hazard',
    'secured',
    'intel',
];

export const elevationLevelOptions: ElevationLevel[] = ['none', 'raised', 'floating', 'overlay'];
export const elevationDirectionOptions: ElevationDirection[] = ['up', 'right', 'down', 'left'];

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
    'hover-focus',
    'active-pressed',
    'disabled',
];

export const DEFAULT_SIZE: SizeVariant = 'sm';
export const DEFAULT_SURFACE_VARIANT: SurfaceVariant = 'ghost';
export const DEFAULT_FILL_VARIANT: FillVariant = 'fill-inverse';

import { allColorShades, colorOptions, fillVariantOptions, sizeOptions, surfaceVariantOptions } from '@ui';

export { colorOptions, fillVariantOptions, sizeOptions, surfaceVariantOptions };

export const colorControl = { control: 'select', options: colorOptions } as const;
export const booleanControl = { control: 'boolean' } as const;
export const sizeControl = { control: 'select', options: sizeOptions } as const;
export const fillVariantControl = { control: 'select', options: fillVariantOptions } as const;
export const surfaceVariantControl = { control: 'select', options: surfaceVariantOptions } as const;
export const optionalColorControl = {
    control: 'select',
    options: ['Default', ...colorOptions],
    mapping: { Default: undefined },
} as const;
export const optionalShadeControl = {
    control: 'select',
    options: ['Default', ...allColorShades],
    mapping: { Default: undefined },
} as const;
export const themeModeControl = {
    control: 'select',
    options: ['Theme', 'light', 'dark'],
    mapping: { Theme: undefined },
} as const;

import { ColorVariant, FillVariant, SizeVariant, SurfaceVariant } from './model';
import { ChipColor } from './chip';

export const colorOptions: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
export const chipColorOptions: ChipColor[] = ['warning', 'success', 'error', 'info', ...colorOptions];
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

/**
 * Extracts given property named as given `prop` from the error cause field.
 */
export const getCauseProp = (prop: string, error?: Error): string | undefined => {
    if (!error?.cause || typeof error.cause !== 'object' || !(prop in error.cause)) {
        return;
    }
    const cause = error.cause as { [key in string]: unknown };
    if (typeof cause[prop] === 'string') {
        return cause[prop];
    }
};

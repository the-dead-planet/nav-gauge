import { ReactNode } from 'react';
import { ColorVariant, Option, SizeVariant, FillVariant } from '../model';

export interface DropdownOption<T> extends Option<T> {
    prepend?: ReactNode;
    selectedPrepend?: ReactNode;
    icon?: string;
}

export interface DropdownProps<T> {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
    value: T;
    options: DropdownOption<T>[];
    onChange?: (value: T) => void;
    placeholder?: string;
    disabled?: boolean;
}

import { ReactNode } from 'react';
import { AppearanceProps, Option, FillVariant } from '../model';

export interface DropdownOption<T> extends Option<T> {
    prepend?: ReactNode;
    selectedPrepend?: ReactNode;
    icon?: string;
}

export interface DropdownProps<T> extends AppearanceProps<FillVariant> {
    value: T;
    options: DropdownOption<T>[];
    onChange?: (value: T) => void;
    placeholder?: string;
}

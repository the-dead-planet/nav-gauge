import { ReactNode } from 'react';
import { Option } from '../../model';
import { AppearanceProps, FillVariant } from '../../design-system/model';

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

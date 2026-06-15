import { ColorVariant, Option, SizeVariant, SurfaceFillVariant } from "../model";

export interface DropdownOption<T> extends Option<T> {
    icon?: string;
}

export interface DropdownProps<T> {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    value: T;
    options: DropdownOption<T>[];
    onChange?: (value: T) => void;
    placeholder?: string;
    disabled?: boolean;
}

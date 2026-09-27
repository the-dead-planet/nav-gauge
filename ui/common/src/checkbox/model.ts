import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../model";

export interface CheckboxProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    variant?: 'fill' | 'fill-inverse';
    size?: SizeVariant;
    disabled?: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

import { ColorVariant, SizeVariant, FillVariant } from "../model";

export interface TextInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    autoSelect?: boolean;
}

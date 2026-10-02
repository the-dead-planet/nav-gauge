import { ColorVariant, SizeVariant, FillVariant } from "../model";

export interface ColorInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

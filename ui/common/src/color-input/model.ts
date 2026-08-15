import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface ColorInputProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

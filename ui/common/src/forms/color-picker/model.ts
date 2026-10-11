import { FillVariant, SizeVariant } from "../../design-system/model";

export interface ColorPickerProps {
    label?: string;
    value: string;
    opacityLabel?: string;
    size?: SizeVariant;
    variant?: FillVariant;
    disabled?: boolean;
    onChange: (value: string) => void;
}

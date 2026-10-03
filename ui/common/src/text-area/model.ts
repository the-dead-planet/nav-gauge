import { ColorVariant, SizeVariant, FillVariant } from "../model";

export interface TextAreaProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: FillVariant;
    label: string;
    autoSelect?: boolean;
}

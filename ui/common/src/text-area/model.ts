import { ColorVariant, SizeVariant, SurfaceFillVariant } from "../model";

export interface TextAreaProps {
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceFillVariant;
    label: string;
    autoSelect?: boolean;
}

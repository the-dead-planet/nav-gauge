import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceFillVariant } from "../../model";

export type PanelShape = 'default';

export interface PanelProps {
    shape?: PanelShape;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    color?: ColorVariant;
    padding?: SizeVariant;
    highlightColor?: ColorVariant;
    variant?: SurfaceFillVariant;
    themeMode?: boolean;
    active?: boolean;
    children?: ReactNode;
}

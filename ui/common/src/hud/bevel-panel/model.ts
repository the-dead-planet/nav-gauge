import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceFillVariant } from "../../model";
import { ThemeMode } from "../../theme";

export interface BevelPanelProps {
    bevel?: number;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    color?: ColorVariant;
    padding?: SizeVariant;
    highlightColor?: ColorVariant;
    variant?: SurfaceFillVariant;
    themeMode?: ThemeMode;
    active?: boolean;
    children?: ReactNode;
}

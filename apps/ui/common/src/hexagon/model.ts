import { ReactNode } from "react";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceVariant } from "../model";

export type HexagonShape = 'pointy-top' | 'flat-top';

export interface HexagonProps {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceVariant;
    themeMode?: boolean;
    active?: boolean;
    children?: ReactNode;
}

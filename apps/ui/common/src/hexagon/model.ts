import { ReactNode } from "react";
import { ColorVariant, SizeVariant, SurfaceVariant } from "../model";

export type HexagonShape = 'pointy-top' | 'flat-top';
export type HexagonHoverStyle = 'glow' | 'fill' | 'animate-borders-glow';

export interface HexagonProps {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    hoverStyle?: HexagonHoverStyle;
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    size?: SizeVariant;
    variant?: SurfaceVariant;
    themeMode?: boolean;
    children?: ReactNode;
}

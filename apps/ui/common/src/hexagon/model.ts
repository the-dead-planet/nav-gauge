import { ReactNode } from "react";
import { ColorVariant } from "../model";

export type HexagonVariant = 'pointy-top' | 'flat-top';
export type HexagonHoverStyle = 'glow' | 'fill' | 'animate-borders';

export interface HexagonProps {
    variant?: HexagonVariant;
    strokeWidth?: number;
    interactive?: boolean;
    hoverStyle?: HexagonHoverStyle;
    color?: ColorVariant;
    children?: ReactNode;
}

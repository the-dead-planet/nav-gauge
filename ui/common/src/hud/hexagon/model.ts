import { ReactNode } from "react";
import { AppearancePropsBase, GlowStyle, SizeVariant, SurfaceVariant } from "../../model";

export type HexagonShape = 'pointy-top' | 'flat-top';

export interface HexagonProps extends AppearancePropsBase<SurfaceVariant> {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    size?: SizeVariant;
    children?: ReactNode;
}

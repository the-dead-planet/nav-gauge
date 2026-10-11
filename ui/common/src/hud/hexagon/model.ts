import { ReactNode } from "react";
import { AppearancePropsBase, ActiveGlow, SizeVariant, SurfaceVariant } from "../../model";

export type HexagonShape = 'pointy-top' | 'flat-top';

export interface HexagonProps extends AppearancePropsBase<SurfaceVariant> {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    size?: SizeVariant;
    children?: ReactNode;
}

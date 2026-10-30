import { ReactNode } from "react";
import { AppearancePropsBase, ActiveGlow, SizeVariant, SurfaceVariant, HexagonShape } from "../../design-system/model";

export interface HexagonProps extends AppearancePropsBase<SurfaceVariant> {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    size?: SizeVariant;
    children?: ReactNode;
}

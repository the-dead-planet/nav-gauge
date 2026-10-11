import { ReactNode } from "react";
import { AppearancePropsBase, InteractionGlow, SizeVariant, SurfaceVariant } from "../../model";

export type HexagonShape = 'pointy-top' | 'flat-top';

export interface HexagonProps extends AppearancePropsBase<SurfaceVariant> {
    shape?: HexagonShape;
    strokeWidth?: number;
    interactive?: boolean;
    interactionGlow?: InteractionGlow;
    size?: SizeVariant;
    children?: ReactNode;
}

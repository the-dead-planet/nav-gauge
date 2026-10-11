import { ReactNode } from "react";
import { AppearancePropsBase, ActiveGlow, FillVariant } from "../../design-system/model";

export type PanelShape = 'default';

export interface PanelProps extends AppearancePropsBase<FillVariant> {
    shape?: PanelShape;
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    /**
     * Defaults to 2
     */
    borderWidth?: number;
    children?: ReactNode;
}

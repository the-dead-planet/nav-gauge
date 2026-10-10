import { ReactNode } from "react";
import { AppearancePropsBase, GlowStyle, FillVariant } from "../../model";

export type PanelShape = 'default';

export interface PanelProps extends AppearancePropsBase<FillVariant> {
    shape?: PanelShape;
    interactive?: boolean;
    glowStyle?: GlowStyle;
    /**
     * Defaults to 2
     */
    borderWidth?: number;
    children?: ReactNode;
}

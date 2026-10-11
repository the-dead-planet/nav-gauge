import { ReactNode } from "react";
import { AppearancePropsBase, InteractionGlow, FillVariant } from "../../model";

export type PanelShape = 'default';

export interface PanelProps extends AppearancePropsBase<FillVariant> {
    shape?: PanelShape;
    interactive?: boolean;
    interactionGlow?: InteractionGlow;
    /**
     * Defaults to 2
     */
    borderWidth?: number;
    children?: ReactNode;
}

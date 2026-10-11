import { ReactNode } from "react";
import { AppearancePropsBase, InteractionGlow, SizeVariant, FillVariant } from "../../model";

export interface BevelPanelProps extends AppearancePropsBase<FillVariant> {
    interactive?: boolean;
    interactionGlow?: InteractionGlow;
    /** Selects a predefined bevel depth. Does not add content padding. Defaults to `lg`. */
    size?: SizeVariant;
    children?: ReactNode;
}

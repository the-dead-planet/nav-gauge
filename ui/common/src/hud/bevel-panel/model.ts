import { ReactNode } from "react";
import { AppearancePropsBase, ActiveGlow, SizeVariant, FillVariant } from "../../model";

export interface BevelPanelProps extends AppearancePropsBase<FillVariant> {
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    /** Selects a predefined bevel depth. Does not add content padding. Defaults to `lg`. */
    size?: SizeVariant;
    children?: ReactNode;
}

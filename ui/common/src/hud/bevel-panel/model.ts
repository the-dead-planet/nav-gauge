import { ReactNode } from "react";
import { AppearancePropsBase, GlowStyle, SizeVariant, FillVariant } from "../../model";

export interface BevelPanelProps extends AppearancePropsBase<FillVariant> {
    interactive?: boolean;
    glowStyle?: GlowStyle;
    /** Selects a predefined bevel depth. Does not add content padding. Defaults to `lg`. */
    size?: SizeVariant;
    children?: ReactNode;
}

import { ReactNode } from "react";
import {
    AppearancePropsBase,
    FillVariant,
    SizeVariant,
} from "../../design-system/model";
import { ResolvedThemeAppearance } from "../../design-system/theme/model";

export interface OctagonalPanelProps extends AppearancePropsBase<FillVariant> {
    /** Selects corner depth without adding content padding. */
    size?: SizeVariant;
    children?: ReactNode;
}

export interface OctagonalSurfaceProps {
    width: number;
    height: number;
    size?: SizeVariant;
    appearance: ResolvedThemeAppearance;
    /** Fits an equal-edged octagon inside the available dimensions. */
    regular?: boolean;
    strokeWidth?: number;
    showGlow?: boolean;
}

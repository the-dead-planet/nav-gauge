import { ReactNode } from "react";
import {
    AppearancePropsBase,
    ActiveGlow,
    SizeVariant,
    FillVariant,
    HexagonShape,
} from "../../design-system/model";

export interface HexagonalPanelProps extends AppearancePropsBase<FillVariant> {
    shape?: HexagonShape;
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    /** Selects the triangular end depth without adding content padding. */
    size?: SizeVariant;
    children?: ReactNode;
}

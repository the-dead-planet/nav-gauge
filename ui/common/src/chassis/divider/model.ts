import { ColorVariant, SpacingVariant } from "../../design-system/model";
import { LayoutOrientation } from "../../chassis/model";

export interface DividerProps {
    orientation?: LayoutOrientation;
    color?: ColorVariant;
    m?: SpacingVariant;
    mv?: SpacingVariant;
    mh?: SpacingVariant;
    mt?: SpacingVariant;
    mr?: SpacingVariant;
    mb?: SpacingVariant;
    ml?: SpacingVariant;
}

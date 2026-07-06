import { ColorVariant, SpacingVariant } from "../model";

export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    color?: ColorVariant;
    m?: SpacingVariant;
    mv?: SpacingVariant;
    mh?: SpacingVariant;
    mt?: SpacingVariant;
    mr?: SpacingVariant;
    mb?: SpacingVariant;
    ml?: SpacingVariant;
}

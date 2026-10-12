import { ReactNode } from "react";
import { SpacingVariant } from "../../design-system/model";
import { AlignItems, JustifyContent } from "../../chassis/model";

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export interface FlexBoxProps {
    direction?: FlexDirection;
    gap?: SpacingVariant;
    rowGap?: SpacingVariant;
    colGap?: SpacingVariant;
    justifyContent?: JustifyContent;
    alignItems?: AlignItems;
    children?: ReactNode;
}

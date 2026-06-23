import { ReactNode } from "react";
import { AlignItems, JustifyContent, SpacingVariant } from "../model";

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

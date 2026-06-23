import { ReactNode } from "react";
import { AlignItems, JustifyContent, SpacingVariant } from "../model";

export type EqualColumnCount = 'equal-1' | 'equal-2' | 'equal-3' | 'equal-4' | 'equal-5' | 'equal-6';
export type MaxContentColumnCount = 'max-content-1' | 'max-content-2' | 'max-content-3' | 'max-content-4' | 'max-content-5' | 'max-content-6';
export type GridTemplateVariant = EqualColumnCount | MaxContentColumnCount;

export interface GridProps {
    gap?: SpacingVariant;
    rowGap?: SpacingVariant;
    cols?: GridTemplateVariant;
    colGap?: SpacingVariant;
    justifyContent?: JustifyContent;
    alignItems?: AlignItems;
    children?: ReactNode;
}

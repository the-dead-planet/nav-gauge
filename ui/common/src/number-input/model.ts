import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../model";

export type NumberInputPlacement = 'start' | 'end' | 'above' | 'below';

export interface NumberInputProps extends AppearanceProps<FillVariant> {
    label?: ReactNode;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    autoSelect?: boolean;
    ariaLabel?: string;
    unit?: string;
    showStepControls?: boolean;
}

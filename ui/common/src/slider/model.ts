import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../model";

export interface SliderProps extends AppearanceProps<FillVariant> {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange?: (value: number) => void;
    id?: string;
    label?: ReactNode;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    ariaLabel?: string;
}

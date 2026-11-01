import { ReactNode } from "react";
import {
    ActiveGlow,
    AppearanceProps,
    FillVariant,
} from "../../design-system/model";

export interface SliderProps extends AppearanceProps<FillVariant> {
    activeGlow?: ActiveGlow;
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

export interface SliderControlRowProps extends Omit<
    SliderProps,
    "id" | "label" | "activeGlow"
> {
    children: ReactNode;
}

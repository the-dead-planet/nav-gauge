import { ReactNode } from "react";
import { AppearanceProps } from "../../design-system/model";
import { NumberInputPlacement } from "../number-input";

export interface IconRotateInputProps extends AppearanceProps {
    icon?: string;
    value: number;
    onChange?: (value: number) => void;
    valueAdjustment?: number;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    label?: string;
    showNumberInput?: boolean;
    showStepControls?: boolean;
    /** Appearance overrides for the optional step buttons, independent of the dial. */
    stepControlsProps?: AppearanceProps;
    numberInputPlacement?: NumberInputPlacement;
    ariaLabel?: string;
}

export interface IconRotateControlRowProps extends Omit<
    IconRotateInputProps,
    "icon" | "id" | "valueAdjustment" | "variant"
> {
    children: ReactNode;
}

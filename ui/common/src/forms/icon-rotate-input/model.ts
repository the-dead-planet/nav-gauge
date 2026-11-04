import { AppearanceProps } from "../../design-system/model";
import { NumberInputPlacement } from "../number-input";

export interface IconRotateInputProps extends Omit<AppearanceProps, "variant"> {
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
    numberInputPlacement?: NumberInputPlacement;
    ariaLabel?: string;
}

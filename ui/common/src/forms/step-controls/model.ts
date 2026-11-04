import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../../design-system/model";

export interface StepControlsProps extends AppearanceProps<FillVariant> {
    children: ReactNode;
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    ariaLabel?: string;
}

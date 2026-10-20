import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../../design-system/model";
import { LayoutOrientation } from "../../chassis/model";

export interface ToggleSwitchProps extends AppearanceProps<FillVariant> {
    label?: ReactNode;
    orientation?: LayoutOrientation;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

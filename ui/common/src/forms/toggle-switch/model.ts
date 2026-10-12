import { ReactNode } from "react";
import { AppearanceProps, SurfaceVariant } from "../../design-system/model";
import { LayoutOrientation } from "../../chassis/model";

export interface ToggleSwitchProps extends AppearanceProps<SurfaceVariant> {
    label?: ReactNode;
    orientation?: LayoutOrientation;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

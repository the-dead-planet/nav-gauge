import { ReactNode } from "react";
import { AppearanceProps, LayoutOrientation, SurfaceVariant } from "../model";

export interface ToggleSwitchProps extends AppearanceProps<SurfaceVariant> {
    label?: ReactNode;
    orientation?: LayoutOrientation;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

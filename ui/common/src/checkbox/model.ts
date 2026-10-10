import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../model";

export interface CheckboxProps extends AppearanceProps<FillVariant> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

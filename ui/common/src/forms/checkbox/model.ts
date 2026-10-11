import { ReactNode } from "react";
import { AppearanceProps, FillVariant } from "../../design-system/model";

export interface CheckboxProps extends AppearanceProps<FillVariant> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

import { ReactNode } from "react";
import { AppearanceProps, FillVariant, CornerVariant } from "../../design-system/model";

export interface CheckboxProps extends AppearanceProps<FillVariant> {
    corners?: CornerVariant;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children?: ReactNode;
}

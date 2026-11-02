import { ReactNode } from "react";
import { AppearancePropsBase, SizeVariant } from "../../design-system/model";

export interface FieldsetProps extends AppearancePropsBase {
    label: string;
    prepend?: ReactNode;
    append?: ReactNode;
    size?: SizeVariant;
    /**
     * Defaults to true
     */
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: ReactNode;
}

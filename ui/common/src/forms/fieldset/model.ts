import { ReactNode } from "react";
import { ColorVariant, SizeVariant } from "../../model";

export interface FieldsetProps {
    label: string;
    prepend?: ReactNode;
    append?: ReactNode;
    size?: SizeVariant;
    color?: ColorVariant;
    /**
     * Defaults to true
     */
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: ReactNode;
}

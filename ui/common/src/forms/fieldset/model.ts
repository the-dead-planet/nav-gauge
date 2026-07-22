import { ReactNode } from "react";
import { SizeVariant } from "../../model";

export interface FieldsetProps {
    label: string;
    prepend?: ReactNode;
    size?: SizeVariant;
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    children?: ReactNode;
}

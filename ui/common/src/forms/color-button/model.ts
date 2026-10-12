import { SizeVariant } from "../../design-system/model";

export interface ColorButtonProps {
    value: string;
    label?: string;
    size?: SizeVariant;
    selected?: boolean;
    disabled?: boolean;
}

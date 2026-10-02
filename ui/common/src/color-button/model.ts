import { SizeVariant } from "../model";

export interface ColorButtonProps {
    value: string;
    label?: string;
    size?: SizeVariant;
    selected?: boolean;
    disabled?: boolean;
}

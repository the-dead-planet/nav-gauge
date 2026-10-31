import { AppearanceProps, FillVariant } from "../../design-system/model";

export interface TextAreaProps extends AppearanceProps<FillVariant> {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    autoSelect?: boolean;
}

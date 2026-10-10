import { AppearanceProps, FillVariant } from "../model";

export interface TextInputProps extends AppearanceProps<FillVariant> {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    autoSelect?: boolean;
}

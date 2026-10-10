import { AppearanceProps, FillVariant } from "../model";

export interface ColorInputProps extends AppearanceProps<FillVariant> {
    label: string;
    value: string;
    onChange: (value: string) => void;
    showColorButton?: boolean;
    showValueInput?: boolean;
    showFormatSelect?: boolean;
}

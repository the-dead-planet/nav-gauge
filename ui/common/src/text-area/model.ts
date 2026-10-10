import { AppearanceProps, FillVariant } from "../model";

export interface TextAreaProps extends AppearanceProps<FillVariant> {
    label: string;
    autoSelect?: boolean;
}

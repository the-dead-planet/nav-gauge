import { AppearanceProps, FillVariant } from "../../design-system/model";

export interface TextAreaProps extends AppearanceProps<FillVariant> {
    label: string;
    autoSelect?: boolean;
}

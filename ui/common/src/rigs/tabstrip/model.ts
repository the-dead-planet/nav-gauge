import { ReactNode } from 'react';
import { AppearanceProps, FillVariant } from '../../design-system/model';

export interface TabstripOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

export interface TabstripProps extends AppearanceProps<FillVariant> {
    children?: ReactNode;
    options: readonly TabstripOption[];
    value: string;
    onChange: (value: string) => void;
    spread?: boolean;
    overflowAccessibilityLabel: string;
}

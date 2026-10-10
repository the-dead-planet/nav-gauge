import { ReactNode } from 'react';
import { AppearanceProps, SurfaceVariant } from '../../model';

export type TabstripVariant = Extract<SurfaceVariant, 'fill-inverse' | 'fill-translucent' | 'outline'>;

export interface TabstripOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}

export interface TabstripProps extends AppearanceProps<TabstripVariant> {
    children?: ReactNode;
    options: readonly TabstripOption[];
    value: string;
    onChange: (value: string) => void;
    spread?: boolean;
    overflowAccessibilityLabel: string;
}

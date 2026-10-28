import { ReactNode } from 'react';
import { ActionButtonVariants, SizeVariant } from '../../design-system/model';

export interface TileProps {
    name: string;
    size?: SizeVariant;
    append?: ReactNode;
    description?: string;
    actions?: (size: SizeVariant, variants: ActionButtonVariants) => ReactNode;
    children?: ReactNode;
}

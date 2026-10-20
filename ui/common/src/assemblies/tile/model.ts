import { ReactNode } from 'react';
import { SizeVariant } from '../../design-system/model';

export interface TileProps {
    name: string;
    size?: SizeVariant;
    append?: ReactNode;
    description?: string;
    actions?: (size: SizeVariant) => ReactNode;
    children?: ReactNode;
}

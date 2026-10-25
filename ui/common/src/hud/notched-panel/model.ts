import { ReactNode } from 'react';
import { AppearancePropsBase, ActiveGlow, FillVariant } from '../../design-system/model';

export interface NotchedPanelProps extends AppearancePropsBase<FillVariant> {
    interactive?: boolean;
    activeGlow?: ActiveGlow;
    header?: ReactNode;
    children?: ReactNode;
}

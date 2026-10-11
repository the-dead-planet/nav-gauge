import { ReactNode } from 'react';
import { AppearancePropsBase, ActiveGlow, FillVariant } from '../../design-system/model';

export interface NotchedPanelProps extends AppearancePropsBase<FillVariant> {
    activeGlow?: ActiveGlow;
    header?: ReactNode;
    children?: ReactNode;
}

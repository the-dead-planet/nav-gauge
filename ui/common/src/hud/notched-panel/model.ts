import { ReactNode } from 'react';
import { AppearancePropsBase, GlowStyle, FillVariant } from '../../model';

export interface NotchedPanelProps extends AppearancePropsBase<FillVariant> {
    glowStyle?: GlowStyle;
    header?: ReactNode;
    children?: ReactNode;
}

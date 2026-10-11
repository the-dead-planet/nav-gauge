import { ReactNode } from 'react';
import { AppearancePropsBase, InteractionGlow, FillVariant } from '../../model';

export interface NotchedPanelProps extends AppearancePropsBase<FillVariant> {
    interactionGlow?: InteractionGlow;
    header?: ReactNode;
    children?: ReactNode;
}

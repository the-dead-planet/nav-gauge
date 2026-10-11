import { ReactNode } from 'react';
import { ColorVariant, InteractionGlow, SizeVariant } from '../../model';

export type HudDecorationCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface HudDecorationProps {
    children: ReactNode;
    color?: ColorVariant;
    size?: SizeVariant;
    interactionGlow?: InteractionGlow;
    corners?: readonly HudDecorationCorner[];
}

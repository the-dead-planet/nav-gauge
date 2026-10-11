import { ReactNode } from 'react';
import { ColorVariant, ActiveGlow, SizeVariant } from '../../design-system/model';

export type HudDecorationCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface HudDecorationProps {
    children: ReactNode;
    color?: ColorVariant;
    size?: SizeVariant;
    activeGlow?: ActiveGlow;
    corners?: readonly HudDecorationCorner[];
}

import { ReactNode } from 'react';
import { ColorVariant, ActiveGlow } from '../../design-system/model';

export type HudConnectorAnchor =
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'right'
    | 'bottom-right'
    | 'bottom'
    | 'bottom-left'
    | 'left'
    | 'center';

export interface HudConnectorProps {
    children: ReactNode;
    color?: ColorVariant;
    activeGlow?: ActiveGlow;
    fromAnchor?: HudConnectorAnchor;
    toAnchor?: HudConnectorAnchor;
}

import { ReactNode } from 'react';
import { ColorVariant, InteractionGlow } from '../../model';

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
    interactionGlow?: InteractionGlow;
    fromAnchor?: HudConnectorAnchor;
    toAnchor?: HudConnectorAnchor;
}

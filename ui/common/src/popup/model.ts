import { PanelProps } from '../hud';
import { MenuAnchor } from '../menu';
import { ReactNode } from 'react';

export interface PopupProps {
    anchor?: React.RefObject<HTMLElement | null>;
    position?: { x: number; y: number };
    variant?: PanelProps['variant'];
    shape?: PanelProps['shape'];
    placement?: MenuAnchor;
    dismissOnClickAway?: boolean;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

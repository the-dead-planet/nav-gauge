import { MenuAnchor, MenuPosition } from '../menu';
import { ReactNode } from 'react';

export interface PopupProps {
    anchor?: React.RefObject<HTMLElement | null>;
    position?: { x: number; y: number };
    placement?: MenuAnchor;
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
}

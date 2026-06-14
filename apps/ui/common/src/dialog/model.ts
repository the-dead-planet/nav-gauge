import { ReactNode } from "react";

export type DialogPlacement = 'middle' | 'right-drawer' | 'left-drawer';

export interface DialogProps {
    header: string;
    placement?: DialogPlacement;
    onClose: () => void;
    children?: ReactNode;
}
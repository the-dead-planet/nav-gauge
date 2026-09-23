import { ReactNode } from "react";
import { ColorVariant, SurfaceFillVariant } from "../model";

export type DialogPlacement = 'middle' | 'right-drawer' | 'left-drawer';

export interface DialogProps {
    header: string;
    color?: ColorVariant;
    variant?: SurfaceFillVariant;
    placement?: DialogPlacement;
    closeText: ReactNode;
    onClose: () => void;
    save?: {
        saveText: ReactNode;
        onSave: () => void;
    }
    children?: ReactNode;
}

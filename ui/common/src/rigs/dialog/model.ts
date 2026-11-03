import { ReactNode } from "react";
import { ColorVariant, FillVariant } from "../../design-system/model";
import { ThemeMode } from "../../design-system/theme/model";

export type DialogPlacement = 'middle' | 'right-drawer' | 'left-drawer';

export interface DialogProps {
    /** Overrides the dialog theme; otherwise inherits the surrounding theme. */
    themeMode?: ThemeMode;
    header: string;
    color?: ColorVariant;
    variant?: FillVariant;
    placement?: DialogPlacement;
    closeText: ReactNode;
    onClose: () => void;
    save?: {
        saveText: ReactNode;
        onSave: () => void;
    }
    children?: ReactNode;
}

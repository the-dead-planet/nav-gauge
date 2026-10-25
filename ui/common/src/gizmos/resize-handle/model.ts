import { ReactNode } from 'react';
import { ColorVariant, FillVariant } from '../../design-system/model';

export interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    side?: 'top' | 'right' | 'left';
    color?: ColorVariant;
    highlightColor?: ColorVariant;
    /** Appearance of the decorative grips only. Defaults to `fill-inverse`. */
    variant?: FillVariant;
    onDrag: (delta: number) => void;
    onDragStart?: (clientX: number) => void;
    onDragEnd?: () => void;
    disabled?: boolean;
    tooltip: ReactNode;
}

export interface ResizeHandleGripProps {
    position: number;
    direction: ResizeHandleProps['direction'];
    side?: ResizeHandleProps['side'];
}

import { ReactNode } from 'react';
import { ColorVariant } from '../../design-system/model';

export interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    side?: 'top' | 'right' | 'left';
    color?: ColorVariant;
    highlightColor?: ColorVariant;
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

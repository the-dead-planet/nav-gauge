import { ColorVariant } from '../model';

export interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    side?: 'top' | 'right' | 'left';
    color?: ColorVariant;
    onDrag: (delta: number) => void;
    onDragStart?: (clientX: number) => void;
    onDragEnd?: () => void;
    disabled?: boolean;
}

export interface ResizeHandleGripProps {
    position: number;
    isDragging: boolean;
    direction: ResizeHandleProps['direction'];
    side?: ResizeHandleProps['side'];
    color?: ResizeHandleProps['color'];
}

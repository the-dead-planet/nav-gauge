import { ColorVariant } from '../model';

export interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    side?: 'top' | 'right' | 'bottom' | 'left';
    color?: ColorVariant;
    onDrag: (delta: number) => void;
    onDragStart?: (clientX: number) => void;
    onDragEnd?: () => void;
    disabled?: boolean;
}

export const getResizeHandleGripPoints = (
    direction: ResizeHandleProps['direction'],
    side: NonNullable<ResizeHandleProps['side']>,
): string => {
    if (direction === 'horizontal') {
        return side === 'right'
            ? '4,0 6,0 8,2 8,22 6,24 4,24'
            : '2,0 4,0 4,24 2,24 0,22 0,2';
    }

    return side === 'bottom'
        ? '0,4 24,4 24,6 22,8 2,8 0,6'
        : '2,0 22,0 24,2 24,4 0,4 0,2';
};

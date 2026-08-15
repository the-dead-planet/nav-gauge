export interface ResizeHandleProps {
    direction: 'horizontal' | 'vertical';
    onDrag: (delta: number) => void;
    onDragStart?: (clientX: number) => void;
    onDragEnd?: () => void;
    disabled?: boolean;
}

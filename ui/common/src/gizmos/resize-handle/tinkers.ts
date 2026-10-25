import { ResizeHandleProps } from './model';
import { appearanceColorOptions, DEFAULT_COLOR, DEFAULT_FILL_VARIANT, fillVariantOptions } from '../../design-system';
import { StoryControls } from '../../storybook';

export const resizeHandleDirections: ResizeHandleProps['direction'][] = ['horizontal', 'vertical'];
export const resizeHandleStoryArgs: Omit<ResizeHandleProps, 'onDrag' | 'onDragStart' | 'onDragEnd'> = {
    direction: 'horizontal',
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    disabled: false,
    tooltip: 'Drag or use arrow keys to resize',
};
export const resizeHandleStoryControls: StoryControls<ResizeHandleProps> = {
    direction: { control: 'select', options: resizeHandleDirections },
    side: { control: 'select', options: ['top', 'right', 'left'] },
    color: { control: 'select', options: appearanceColorOptions },
    variant: {
        control: 'select',
        options: fillVariantOptions,
    },
    highlightColor: { control: 'select', options: ['Default', ...appearanceColorOptions], mapping: { Default: undefined } },
    disabled: { control: 'boolean' },
    tooltip: { control: 'text' },
};

export const getResizeHandleGripPoints = (
    direction: ResizeHandleProps['direction'],
    side: NonNullable<ResizeHandleProps['side']>,
): string => {
    if (direction === 'horizontal') {
        return side === 'right'
            ? '4,0 6,0 8,2 8,22 6,24 4,24'
            : '2,0 4,0 4,24 2,24 0,22 0,2';
    }

    return '2,0 22,0 24,2 24,4 0,4 0,2';
};

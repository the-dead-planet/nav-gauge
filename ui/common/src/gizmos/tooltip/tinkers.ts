import { TooltipPlacement, TooltipProps, TooltipRectangle } from './model';
import { appearanceColorOptions, DEFAULT_COLOR, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, fillVariantOptions, sizeOptions } from '../../design-system';
import { StoryControls } from '../../storybook';

export const tooltipStoryArgs: Omit<TooltipProps, 'children'> = {
    content: 'Tooltip',
    placement: 'auto',
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    size: DEFAULT_SIZE,
    maxWidth: 220,
    showConnection: false,
};
export const tooltipStoryControls: StoryControls<TooltipProps> = {
    content: { control: 'text' },
    placement: { control: 'select', options: ['auto', 'top', 'right', 'bottom', 'left'] },
    color: { control: 'select', options: appearanceColorOptions },
    variant: { control: 'select', options: fillVariantOptions },
    size: { control: 'select', options: sizeOptions },
    maxWidth: { control: { type: 'range', min: 100, max: 400, step: 10 } },
    showConnection: { control: 'boolean' },
};

export function getAutoTooltipPlacement(
    trigger: TooltipRectangle,
    tooltip: Pick<TooltipRectangle, 'width' | 'height'>,
    viewportWidth: number,
    viewportHeight: number,
): Exclude<TooltipPlacement, 'auto'> {
    const availableSpace = {
        top: trigger.y,
        bottom: viewportHeight - trigger.y - trigger.height,
        left: trigger.x,
        right: viewportWidth - trigger.x - trigger.width,
    };
    const requiredSpace = {
        top: tooltip.height,
        bottom: tooltip.height,
        left: tooltip.width,
        right: tooltip.width,
    };
    const placements: Exclude<TooltipPlacement, 'auto'>[] = ['top', 'bottom', 'left', 'right'];

    return placements.find((placement) => availableSpace[placement] >= requiredSpace[placement])
        ?? placements.reduce((best, placement) => (
            availableSpace[placement] > availableSpace[best] ? placement : best
        ));
}

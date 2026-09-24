import { TooltipPlacement, TooltipRectangle } from './model';

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

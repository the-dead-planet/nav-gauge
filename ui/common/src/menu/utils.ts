import { MenuAnchor, MenuPosition } from "./model";

export function getIconAndMenuAnchors(placement: MenuAnchor): { icon: MenuAnchor; menu: MenuAnchor } {
    const vertical = placement.startsWith('top') ? 'bottom' : 'top';
    const horizontal = placement.endsWith('right') ? 'right' : 'left';

    return { icon: placement, menu: `${vertical}-${horizontal}` as MenuAnchor };
}

export function getIconAnchorPoint(
    anchor: MenuAnchor,
    iconX: number,
    iconY: number,
    width: number,
    height: number,
): { x: number; y: number } {
    switch (anchor) {
        case 'top-left': return { x: iconX, y: iconY };
        case 'top-right': return { x: iconX + width, y: iconY };
        case 'bottom-left': return { x: iconX, y: iconY + height };
        case 'bottom-right': return { x: iconX + width, y: iconY + height };
    }
}

export function getMenuPosition(
    anchor: MenuAnchor,
    iconAnchor: { x: number; y: number },
    overlayWidth: number,
    overlayHeight: number,
): MenuPosition {
    switch (anchor) {
        case 'top-left': return { top: iconAnchor.y, left: iconAnchor.x };
        case 'top-right': return { top: iconAnchor.y, right: overlayWidth - iconAnchor.x };
        case 'bottom-left': return { bottom: overlayHeight - iconAnchor.y, left: iconAnchor.x };
        case 'bottom-right': return { bottom: overlayHeight - iconAnchor.y, right: overlayWidth - iconAnchor.x };
    }
}

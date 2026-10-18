const MENU_GAP = 4;
const MENU_MAX_HEIGHT = 240;

export function getDropdownMenuPosition(
    triggerTop: number,
    triggerBottom: number,
    menuHeight: number | null,
    windowHeight: number,
): { top: number; maxHeight: number } {
    const spaceBelow = windowHeight - triggerBottom - MENU_GAP;
    const spaceAbove = triggerTop - MENU_GAP;
    const opensAbove = menuHeight !== null && menuHeight > spaceBelow && spaceAbove > 0;

    return {
        top: opensAbove
            ? Math.max(0, triggerTop - menuHeight - MENU_GAP)
            : triggerBottom + MENU_GAP,
        maxHeight: menuHeight === null
            ? MENU_MAX_HEIGHT
            : Math.max(0, Math.min(MENU_MAX_HEIGHT, opensAbove ? spaceAbove : spaceBelow)),
    };
}

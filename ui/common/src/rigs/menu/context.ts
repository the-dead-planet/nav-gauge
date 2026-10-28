import { createContext, RefObject, useContext } from "react";
import { ColorVariant, SizeVariant } from "../../design-system/model";
import { DEFAULT_COLOR, DEFAULT_SIZE } from "../../design-system/tinkers";

export interface MenuContextValue {
    color: ColorVariant;
    highlightColor?: ColorVariant;
    size: SizeVariant;
    onClose: () => void;
    triggerRef?: RefObject<HTMLButtonElement  | null>;
}

export const MenuContext = createContext<MenuContextValue>({
    color: DEFAULT_COLOR,
    size: DEFAULT_SIZE,
    triggerRef: undefined,
    onClose: () => { },
});

export const useMenuContext = () => useContext(MenuContext);
export const useMenuClose = (): (() => void) => useContext(MenuContext).onClose;

import { createContext, RefObject, useContext } from "react";
import { ColorVariant } from "../model";

export interface MenuContextValue {
    color: ColorVariant;
    onClose: () => void;
    triggerRef?: RefObject<HTMLButtonElement  | null>;
}

export const MenuContext = createContext<MenuContextValue>({
    color: 'neutral',
    triggerRef: undefined,
    onClose: () => { },
});

export const useMenuContext = () => useContext(MenuContext);
export const useMenuClose = (): (() => void) => useContext(MenuContext).onClose;

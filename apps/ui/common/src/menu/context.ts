import { createContext, RefObject, useContext } from "react";

export interface MenuContextValue {
    onClose: () => void;
    triggerRef?: RefObject<HTMLButtonElement  | null>;
}

export const MenuContext = createContext<MenuContextValue>({
    triggerRef: undefined,
    onClose: () => { },
});

export const useMenuContext = () => useContext(MenuContext);
export const useMenuClose = (): (() => void) => useContext(MenuContext).onClose;

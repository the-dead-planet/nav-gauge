import { createContext, useContext } from "react";

export interface MenuContextValue {
    onClose: () => void;
}

export const MenuContext = createContext<MenuContextValue>({ onClose: () => { } });

export const useMenuClose = (): (() => void) => useContext(MenuContext).onClose;

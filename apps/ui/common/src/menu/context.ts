import { createContext, useContext } from "react";

export interface MenuContextValue {
    close: () => void;
}

export const MenuContext = createContext<MenuContextValue>({ close: () => { } });

export const useMenuClose = (): (() => void) => useContext(MenuContext).close;

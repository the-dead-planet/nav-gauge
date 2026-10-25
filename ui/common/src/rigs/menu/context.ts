import { createContext, RefObject, useContext } from "react";
import { ColorVariant } from "../../design-system/model";
import { DEFAULT_COLOR } from "../../design-system/tinkers";

export interface MenuContextValue {
    color: ColorVariant;
    onClose: () => void;
    triggerRef?: RefObject<HTMLButtonElement  | null>;
}

export const MenuContext = createContext<MenuContextValue>({
    color: DEFAULT_COLOR,
    triggerRef: undefined,
    onClose: () => { },
});

export const useMenuContext = () => useContext(MenuContext);
export const useMenuClose = (): (() => void) => useContext(MenuContext).onClose;

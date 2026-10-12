import { createContext, useContext } from "react";
import { Theme } from "./theme";

export const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = (): Theme => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeContext provider");
    }

    return context;
};

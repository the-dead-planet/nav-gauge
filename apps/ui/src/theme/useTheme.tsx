import { createContext, useContext } from "react";
import { ThemeSpecification } from "./model";

export const ThemeContext = createContext<ThemeSpecification | undefined>(undefined);

export const useTheme = (): ThemeSpecification => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeContext provider");
    }

    return context;
};

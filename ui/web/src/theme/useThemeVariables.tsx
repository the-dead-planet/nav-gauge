import { allColorShades, DesignSystemColor, fontTypeToFamily, PaletteColor, Theme, ThemeComponentColor } from "@ui";
import { useEffect } from "react";

/**
 * Adds the CSS variables using theme colors in format `--color-<name>`.
 * @example var(--color-background)
 * @example var(--color-yellow-500)
 */
export const useThemeVariables = (theme: Theme) => {
    useEffect(() => {
        for (const [fontType, fontFamilyName] of Object.entries(fontTypeToFamily)) {
            document.documentElement.style.setProperty(
                `--font-${fontType}`,
                fontFamilyName
            );
        }
    }, []);

    useEffect(() => {
        for (const [key] of Object.entries(theme.componentColors)) {
            const componentColorName = key as ThemeComponentColor;
            document.documentElement.style.setProperty(
                `--color-${componentColorName}`,
                theme.componentColor(componentColorName)
            );
        }

        for (const [key] of Object.entries(theme.colors)) {
            const colorName = key as PaletteColor | DesignSystemColor;
            document.documentElement.style.setProperty(
                `--color-${colorName}`,
                theme.color(colorName, 500)
            );

            for (const shade of allColorShades) {
                document.documentElement.style.setProperty(
                    `--color-${colorName}-${shade}`,
                    theme.color(colorName, shade)
                );
            }
        }
        document.body.setAttribute("data-theme", theme.mode);
    }, [theme]);
};

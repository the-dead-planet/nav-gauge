import { useEffect } from "react";
import { allColorShades, colorOptions, DesignSystemColor, fontTypeToFamily, PaletteColor, surfaceVariantOptions, Theme, ThemeComponentColor } from "@ui";

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
        for (const [spacing, spacingValue] of Object.entries(Theme.spacing)) {
            document.documentElement.style.setProperty(
                `--spacing-${spacing}`,
                spacingValue
            );
        }
        for (const [size, metrics] of Object.entries(theme.sizes.control)) {
            for (const [metric, value] of Object.entries(metrics)) {
                document.documentElement.style.setProperty(
                    `--size-control-${size}-${metric.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
                    `${value}px`,
                );
            }
        }
        for (const [layer, zIndex] of Object.entries(Theme.zIndex)) {
            document.documentElement.style.setProperty(
                `--z-index-${layer.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
                String(zIndex),
            );
        }
    }, [theme.sizes.control]);

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
            document.documentElement.style.setProperty(
                `--color-${colorName}-contrast`,
                theme.color(colorName, theme.contrastShade(colorName)),
            );

            for (const shade of allColorShades) {
                document.documentElement.style.setProperty(
                    `--color-${colorName}-${shade}`,
                    theme.color(colorName, shade)
                );
                document.documentElement.style.setProperty(
                    `--color-${colorName}-${shade}-contrast`,
                    theme.color(colorName, theme.contrastShade(colorName, shade)),
                );
            }
        }
        for (const variant of surfaceVariantOptions) {
            for (const color of colorOptions) {
                for (const role of Object.keys(theme.variants[variant].shades)) {
                    const shade = theme.variants[variant].shades[role as keyof typeof theme.variants[typeof variant]['shades']];
                    document.documentElement.style.setProperty(
                        `--variant-${variant}-${color}-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
                        theme.variantColor(variant, color, role as keyof typeof theme.variants[typeof variant]['shades']),
                    );
                    document.documentElement.style.setProperty(
                        `--variant-${variant}-${color}-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}-contrast`,
                        theme.color(color, theme.contrastShade(color, shade)),
                    );
                }
            }
        }
        document.body.setAttribute("data-theme", theme.mode);
    }, [theme]);
};

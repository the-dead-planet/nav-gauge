import { useEffect } from "react";
import {
    allColorShades,
    colorOptions,
    DesignSystemColor,
    fontTypeToFamily,
    PaletteColor,
    surfaceVariantOptions,
    Theme,
    ThemeAppearancePaint,
    ThemeAppearanceInsetEffectPolicy,
    themeAppearanceStateOptions,
    ThemeComponentColor,
} from "@ui";

const appearanceStyleId = 'theme-appearance-variables';

const resolveAppearancePaint = (paint: ThemeAppearancePaint): string => {
    if (paint.type === 'transparent') {
        return 'transparent';
    }
    if (paint.type === 'literal') {
        return paint.value;
    }

    const shade = paint.type === 'contrast'
        ? `${paint.backgroundShade}-contrast`
        : paint.shade;
    const colorProperty = paint.colorProperty === 'highlightColor' ? 'highlight' : 'color';
    const color = `var(--appearance-${colorProperty}-${shade})`;
    return paint.opacity === undefined
        ? color
        : `rgb(from ${color} r g b / ${paint.opacity})`;
};

const transparentInset: ThemeAppearanceInsetEffectPolicy = {
    edgeStart: { type: 'transparent' },
    edgeEnd: { type: 'transparent' },
    shadow: { type: 'transparent' },
    highlight: { type: 'transparent' },
    recess: { type: 'transparent' },
    shadowOpacity: 0,
    highlightOpacity: 0,
};

const createColorRule = (attribute: 'color' | 'highlight', color: string): string => {
    const declarations = allColorShades.flatMap((shade) => [
        `--appearance-${attribute}-${shade}:var(--color-${color}-${shade})`,
        `--appearance-${attribute}-${shade}-contrast:var(--color-${color}-${shade}-contrast)`,
    ]);
    return `[data-appearance-${attribute}="${color}"]{${declarations.join(';')}}`;
};

const createAppearanceRules = (theme: Theme): string => [
    ...colorOptions.map((color) => createColorRule('color', color)),
    ...colorOptions.map((color) => createColorRule('highlight', color)),
    ...surfaceVariantOptions.map((variant) => {
        const policy = theme.appearancePolicies[variant];
        const defaultInset = policy.effects.inset?.default ?? transparentInset;
        const activeInset = policy.effects.inset?.active ?? transparentInset;
        const declarations = [
            ...themeAppearanceStateOptions.flatMap((state) => {
                const statePolicy = policy.states[state];
                return [
                    `--appearance-${state}-background:${resolveAppearancePaint(statePolicy.surface)}`,
                    `--appearance-${state}-border:${resolveAppearancePaint(statePolicy.border)}`,
                    `--appearance-${state}-glyphs:${resolveAppearancePaint(statePolicy.glyphs)}`,
                    `--appearance-${state}-border-width:${statePolicy.border.width}px`,
                ];
            }),
            '--appearance-color:var(--appearance-color-500)',
            '--appearance-glow-color:var(--appearance-highlight-500)',
            `--appearance-backdrop-blur:${policy.effects.backdropBlur}px`,
            `--appearance-inset-default-edge-start:${resolveAppearancePaint(defaultInset.edgeStart)}`,
            `--appearance-inset-default-edge-end:${resolveAppearancePaint(defaultInset.edgeEnd)}`,
            `--appearance-inset-active-edge-start:${resolveAppearancePaint(activeInset.edgeStart)}`,
            `--appearance-inset-active-edge-end:${resolveAppearancePaint(activeInset.edgeEnd)}`,
            `--appearance-inset-default-inner-start:${resolveAppearancePaint(defaultInset.shadow)}`,
            `--appearance-inset-default-inner-end:${resolveAppearancePaint(defaultInset.highlight)}`,
            `--appearance-inset-active-inner-start:${resolveAppearancePaint(activeInset.shadow)}`,
            `--appearance-inset-active-inner-end:${resolveAppearancePaint(activeInset.highlight)}`,
            `--appearance-inset-default-recess:${resolveAppearancePaint(defaultInset.recess)}`,
            `--appearance-inset-active-recess:${resolveAppearancePaint(activeInset.recess)}`,
            `--appearance-inset-default-shadow:3px 3px 4px ${resolveAppearancePaint(defaultInset.shadow)} inset,-2px -2px 4px ${resolveAppearancePaint(defaultInset.highlight)} inset`,
            `--appearance-inset-active-shadow:3px 3px 4px ${resolveAppearancePaint(activeInset.shadow)} inset,-2px -2px 4px ${resolveAppearancePaint(activeInset.highlight)} inset`,
        ];

        return `[data-appearance-variant="${variant}"]{${declarations.join(';')}}`;
    }),
].join('\n');

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
        const appearanceStyle = document.createElement('style');
        appearanceStyle.id = appearanceStyleId;
        appearanceStyle.textContent = createAppearanceRules(theme);
        document.getElementById(appearanceStyleId)?.remove();
        document.head.appendChild(appearanceStyle);

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
        document.body.setAttribute("data-theme", theme.mode);

        return () => appearanceStyle.remove();
    }, [theme]);
};

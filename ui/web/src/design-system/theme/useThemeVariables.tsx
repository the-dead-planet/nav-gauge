import { useEffect } from "react";
import {
    allColorShades,
    appearanceColorOptions,
    ColorVariant,
    DEFAULT_COLOR,
    elevationDirectionOptions,
    elevationLevelOptions,
    ElevationDirection,
    ElevationLevel,
    fontTypeToFamily,
    PaletteColor,
    Theme,
    ThemeAppearancePaint,
    ThemeAppearanceInsetEffectPolicy,
    themeAppearanceStateOptions,
    typographyUsageSpecifications,
} from "@ui";

const appearanceStyleId = 'theme-appearance-variables';
const elevationShadow = (theme: Theme, level: ElevationLevel, direction: ElevationDirection): string => {
    if (level === 'none') {
        return 'none';
    }
    const elevation = theme.elevation(level, direction);
    return `${elevation.offset.x}px ${elevation.offset.y}px ${elevation.blur}px rgba(0, 0, 0, ${elevation.opacity})`;
};

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

const createColorDeclarations = (attribute: 'color' | 'highlight', color: string): string =>
    allColorShades.flatMap((shade) => [
        `--appearance-${attribute}-${shade}:var(--color-${color}-${shade})`,
        `--appearance-${attribute}-${shade}-contrast:var(--color-${color}-${shade}-contrast)`,
    ]).join(';');

const createColorRule = (attribute: 'color' | 'highlight', color: string): string =>
    `[data-appearance-${attribute}="${color}"]{${createColorDeclarations(attribute, color)}}`;

const createAppearanceDeclarations = (policy: Theme['appearancePolicies']['default']): string => {
    const defaultInset = policy.effects.inset?.default ?? transparentInset;
    const activePressedInset = policy.effects.inset?.['active-pressed'] ?? transparentInset;
    return [
        ...themeAppearanceStateOptions.flatMap((state) => {
            const statePolicy = policy.states[state];
            return [
                `--appearance-${state}-surface:${resolveAppearancePaint(statePolicy.surface)}`,
                `--appearance-${state}-border:${resolveAppearancePaint(statePolicy.border)}`,
                `--appearance-${state}-glyphs:${resolveAppearancePaint(statePolicy.glyphs)}`,
                `--appearance-${state}-font-weight:${statePolicy.glyphs.fontWeight ?? 'initial'}`,
                `--appearance-${state}-border-width:${statePolicy.border.width}px`,
            ];
        }),
        '--appearance-color:var(--appearance-color-500)',
        '--appearance-glow-color:var(--appearance-highlight-500)',
        `--appearance-backdrop-blur:${policy.effects.backdropBlur}px`,
        `--appearance-inset-default-edge-start:${resolveAppearancePaint(defaultInset.edgeStart)}`,
        `--appearance-inset-default-edge-end:${resolveAppearancePaint(defaultInset.edgeEnd)}`,
        `--appearance-inset-active-pressed-edge-start:${resolveAppearancePaint(activePressedInset.edgeStart)}`,
        `--appearance-inset-active-pressed-edge-end:${resolveAppearancePaint(activePressedInset.edgeEnd)}`,
        `--appearance-inset-default-inner-start:${resolveAppearancePaint(defaultInset.shadow)}`,
        `--appearance-inset-default-inner-end:${resolveAppearancePaint(defaultInset.highlight)}`,
        `--appearance-inset-active-pressed-inner-start:${resolveAppearancePaint(activePressedInset.shadow)}`,
        `--appearance-inset-active-pressed-inner-end:${resolveAppearancePaint(activePressedInset.highlight)}`,
        `--appearance-inset-default-recess:${resolveAppearancePaint(defaultInset.recess)}`,
        `--appearance-inset-active-pressed-recess:${resolveAppearancePaint(activePressedInset.recess)}`,
        `--appearance-inset-default-shadow:3px 3px 4px ${resolveAppearancePaint(defaultInset.shadow)} inset,-2px -2px 4px ${resolveAppearancePaint(defaultInset.highlight)} inset`,
        `--appearance-inset-active-pressed-shadow:3px 3px 4px ${resolveAppearancePaint(activePressedInset.shadow)} inset,-2px -2px 4px ${resolveAppearancePaint(activePressedInset.highlight)} inset`,
    ].join(';');
};

const createAppearanceRules = (theme: Theme): string => [
    ...appearanceColorOptions.map((color) => createColorRule('color', color)),
    ...appearanceColorOptions.map((color) => createColorRule('highlight', color)),
    `:root{${createColorDeclarations('color', DEFAULT_COLOR)};${createColorDeclarations('highlight', DEFAULT_COLOR)};${createAppearanceDeclarations(theme.appearancePolicies.default)}}`,
    ...Object.entries(theme.appearancePolicies).map(([variant, policy]) =>
        `[data-appearance-variant="${variant}"]{${createAppearanceDeclarations(policy)}}`
    ),
].join('\n');

/**
 * Adds CSS variables using theme colors in format `--color-<name>`.
 * @example var(--color-neutral-500)
 * @example var(--color-intel-300)
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
        for (const [usage, specification] of Object.entries(typographyUsageSpecifications)) {
            document.documentElement.style.setProperty(`--typography-${usage}-font-size`, `${specification.fontSize}px`);
            document.documentElement.style.setProperty(`--typography-${usage}-line-height`, `${specification.lineHeight}px`);
            document.documentElement.style.setProperty(`--typography-${usage}-font-weight`, specification.fontWeight);
        }
        for (const [size, metrics] of Object.entries(theme.sizes.control)) {
            for (const [metric, value] of Object.entries(metrics)) {
                document.documentElement.style.setProperty(
                    `--size-control-${size}-${metric.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
                    `${value}px`,
                );
            }
        }
        for (const [layer, policy] of Object.entries(Theme.layers)) {
            document.documentElement.style.setProperty(
                `--layer-${layer}-z-index`,
                String(policy.zIndex),
            );
            for (const direction of elevationDirectionOptions) {
                document.documentElement.style.setProperty(
                    `--layer-${layer}-${direction}-shadow`,
                    `var(--elevation-${policy.elevation}-${direction}-shadow)`,
                );
                document.documentElement.style.setProperty(
                    `--layer-${layer}-${direction}-filter`,
                    `var(--elevation-${policy.elevation}-${direction}-filter)`,
                );
            }
        }
        for (const level of elevationLevelOptions) {
            for (const direction of elevationDirectionOptions) {
                const shadow = elevationShadow(theme, level, direction);
                document.documentElement.style.setProperty(
                    `--elevation-${level}-${direction}-shadow`,
                    shadow,
                );
                document.documentElement.style.setProperty(
                    `--elevation-${level}-${direction}-filter`,
                    level === 'none' ? 'none' : `drop-shadow(${shadow})`,
                );
            }
        }
    }, [theme]);

    useEffect(() => {
        const appearanceStyle = document.createElement('style');
        appearanceStyle.id = appearanceStyleId;
        appearanceStyle.textContent = createAppearanceRules(theme);
        document.getElementById(appearanceStyleId)?.remove();
        document.head.appendChild(appearanceStyle);

        for (const [key] of Object.entries(theme.colors)) {
            const colorName = key as PaletteColor | ColorVariant;
            document.documentElement.style.setProperty(
                `--color-${colorName}`,
                theme.color(colorName)
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
        document.documentElement.style.colorScheme = theme.mode;
        document.body.setAttribute("data-theme", theme.mode);

        return () => appearanceStyle.remove();
    }, [theme]);
};

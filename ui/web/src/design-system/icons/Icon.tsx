import { CSSProperties, FC } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";
import { IconProps } from "./model";
import {
    appearanceColorOptions,
    DEFAULT_SIZE,
    Icons,
    resolveIconState,
} from "@ui";
import styles from "./icon.module.css";

interface Props {
    src: string;
    /**
     * Defaults to "true"
     */
    ariaHidden?: boolean;
}

export const Icon: FC<Props & IconProps> = ({
    src,
    width,
    height,
    size = DEFAULT_SIZE,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled,
    appearanceState,
    fill,
    stroke,
    strokeWidth,
    ariaHidden = true,
    className,
    style,
    fallback,
    ...props
}) => {
    const state = resolveIconState({ disabled, highlighted, appearanceState });
    const paletteColor = appearanceColorOptions.find(
        (option) => option === color,
    );
    const ownsAppearance =
        color !== undefined ||
        highlightColor !== undefined ||
        glyphsShade !== undefined ||
        highlightGlyphsShade !== undefined ||
        highlighted ||
        disabled ||
        appearanceState !== undefined;
    const selectedColor = paletteColor ?? "neutral";
    const selectedHighlight = highlightColor ?? selectedColor;
    const dimension = (value: typeof width): string | undefined =>
        value === undefined
            ? undefined
            : typeof value === "number" || /^\d+(\.\d+)?$/.test(value)
                ? `${value}px`
                : value;

    const fallbackIcon = () => (
        <Icon
            width="100%"
            height="100%"
            src={Icons.NounProject.Crash}
            fallback={() => <span>Err!</span>}
        />
    );

    return (
        <ReactSVG
            src={src}
            fallback={fallback ?? fallbackIcon}
            wrapper="span"
            aria-hidden={ariaHidden}
            role={ariaHidden ? undefined : "img"}
            aria-disabled={state === "disabled" || undefined}
            data-appearance-variant={ownsAppearance ? "default" : undefined}
            data-appearance-color={ownsAppearance ? selectedColor : undefined}
            data-appearance-highlight={
                ownsAppearance ? selectedHighlight : undefined
            }
            data-appearance-state={ownsAppearance ? state : undefined}
            className={classNames(
                styles.icon,
                styles[`size-${size}`],
                className,
            )}
            style={
                {
                    ...style,
                    "--icon-width": dimension(width),
                    "--icon-height": dimension(height),
                    "--icon-fill": fill,
                    "--icon-stroke": stroke,
                    "--icon-stroke-width": strokeWidth,
                    "--appearance-default-glyphs-override":
                        glyphsShade === undefined
                            ? paletteColor
                                ? undefined
                                : color
                            : `var(--color-${selectedColor}-${glyphsShade})`,
                    "--appearance-hover-focus-glyphs-override":
                        highlightGlyphsShade === undefined
                            ? undefined
                            : `var(--color-${selectedHighlight}-${highlightGlyphsShade})`,
                    "--appearance-active-pressed-glyphs-override":
                        highlightGlyphsShade === undefined
                            ? undefined
                            : `var(--color-${selectedHighlight}-${highlightGlyphsShade})`,
                } as CSSProperties
            }
            {...props}
        />
    );
};

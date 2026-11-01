import { ComponentProps, createElement, ReactElement } from "react";
import classNames from "classnames";
import {
    ActiveGlow,
    AppearancePropsBase,
    DEFAULT_COLOR,
    SizeVariant,
    SurfaceVariant,
    ThemeAppearanceVariant,
    useTheme,
} from "@ui";
import surface from "./surface.module.css";

type Props<Element extends "div" | "button" | "a" | "span" | "ul" | "li"> =
    Omit<AppearancePropsBase<SurfaceVariant>, "variant"> &
        Omit<
            ComponentProps<Element>,
            keyof AppearancePropsBase<SurfaceVariant>
        > & {
            as: Element;
            variant: ThemeAppearanceVariant;
            size?: SizeVariant;
            interactive?: boolean;
            activeGlow?: ActiveGlow;
            rectangle?: boolean;
        };

export const HudSurface = <
    Element extends "div" | "button" | "a" | "span" | "ul" | "li",
>({
    as,
    variant,
    size,
    color = DEFAULT_COLOR,
    highlightColor,
    highlighted,
    disabled,
    interactive = false,
    activeGlow = "none",
    rectangle = false,
    className,
    ...props
}: Props<Element>): ReactElement => {
    const theme = useTheme();
    return createElement(as, {
        ...props,
        ...(size === undefined ? undefined : { "data-size": size }),
        disabled: as === "button" ? disabled : undefined,
        "data-appearance-variant": variant,
        "data-appearance-mode": theme.mode,
        "data-appearance-color": color,
        "data-appearance-highlight": highlightColor ?? color,
        "data-interactive": interactive || undefined,
        "data-highlighted": highlighted || undefined,
        "data-disabled": disabled || undefined,
        "data-glow": activeGlow,
        className: classNames(
            surface.surface,
            rectangle && surface.rectangle,
            className,
        ),
    });
};

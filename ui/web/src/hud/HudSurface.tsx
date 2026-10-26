import { ComponentProps, createElement, ReactElement } from "react";
import classNames from "classnames";
import {
    ActiveGlow,
    AppearancePropsBase,
    DEFAULT_COLOR,
    SurfaceVariant,
} from "@ui";
import surface from "./surface.module.css";

type Props<Element extends "div" | "button" | "a"> =
    AppearancePropsBase<SurfaceVariant> &
        Omit<
            ComponentProps<Element>,
            keyof AppearancePropsBase<SurfaceVariant>
        > & {
            as: Element;
            variant: SurfaceVariant;
            interactive?: boolean;
            activeGlow?: ActiveGlow;
            rectangle?: boolean;
        };

export const HudSurface = <Element extends "div" | "button" | "a">({
    as,
    variant,
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
    return createElement(as, {
        ...props,
        disabled: as === "button" ? disabled : undefined,
        "data-appearance-variant": variant,
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

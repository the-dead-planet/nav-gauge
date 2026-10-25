import { ComponentProps, CSSProperties, FC, RefObject } from "react";
import {
    DEFAULT_COLOR,
    DEFAULT_ELEVATION,
    DEFAULT_FILL_VARIANT,
    PanelProps,
} from "@ui";
import classNames from "classnames";
import surface from "../surface.module.css";
import { useHudInteraction } from "../useHudInteraction";

interface Props {
    forwardRef?: RefObject<HTMLDivElement | null>;
}

export const Panel: FC<PanelProps & Props & ComponentProps<"div">> = ({
    shape: _shape,
    interactive = false,
    activeGlow = "none",
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    borderWidth,
    elevation = DEFAULT_ELEVATION,
    elevationLayer,
    highlighted = false,
    disabled = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
    forwardRef,
    ref,
    className,
    style,
    children,
    ...props
}) => {
    const interaction = useHudInteraction({
        disabled,
        onClick,
        onKeyDown,
        onKeyUp,
        onBlur,
        role,
        tabIndex,
    });
    return (
        <div
            {...props}
            {...interaction}
            ref={forwardRef ?? ref}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor ?? color}
            data-interactive={interactive || !!onClick || undefined}
            data-highlighted={highlighted || undefined}
            data-disabled={disabled || undefined}
            data-glow={activeGlow}
            className={classNames(
                surface.surface,
                surface.rectangle,
                surface[
                    elevationLayer
                        ? `layer-${elevationLayer}`
                        : `elevation-${elevation}`
                ],
                className,
            )}
            style={
                {
                    ...style,
                    ...(borderWidth === undefined
                        ? undefined
                        : {
                              "--appearance-border-width-scale": Math.max(
                                  0,
                                  borderWidth,
                              ),
                          }),
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
};

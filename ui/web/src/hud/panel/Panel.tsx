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
import { HudSurface } from '../HudSurface';

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
        <HudSurface
            as="div"
            {...props}
            {...interaction}
            ref={forwardRef ?? ref}
            variant={variant}
            color={color}
            highlightColor={highlightColor}
            interactive={interactive || !!onClick}
            highlighted={highlighted}
            disabled={disabled}
            activeGlow={activeGlow}
            rectangle
            className={classNames(
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
        </HudSurface>
    );
};

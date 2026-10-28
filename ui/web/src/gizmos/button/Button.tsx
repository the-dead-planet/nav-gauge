import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import {
    ButtonProps,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Span } from "../../design-system/typography";
import { Hexagon } from "../../hud";
import { HudSurface } from "../../hud/HudSurface";
import { Tooltip } from "../tooltip";
import styles from "./button.module.css";

interface Props {
    /** Icon to display before the children. */
    icon?: string;
}

export const Button: FC<ComponentProps<"button"> & Props & ButtonProps> = ({
    color = DEFAULT_COLOR,
    fontType,
    glyphsShade,
    highlightColor,
    highlightGlyphsShade,
    variant = DEFAULT_SURFACE_VARIANT,
    activeGlow = "none",
    size = DEFAULT_SIZE,
    corners = "square",
    highlighted = false,
    disabled,
    type = "button",
    icon,
    iconRotateX = 0,
    iconRotateZ = 0,
    tooltip,
    tooltipPlacement,
    showTooltipConnection,
    "aria-label": ariaLabel,
    children,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const iconSize = theme.sizes.control[size].iconSize;
    const effects = theme.appearancePolicies[variant].effects;
    const appearanceOverrides: CSSProperties = {
        ...(glyphsShade === undefined
            ? undefined
            : {
                  "--appearance-default-glyphs-override": theme.color(
                      color,
                      glyphsShade,
                  ),
              }),
        ...(highlightGlyphsShade === undefined
            ? undefined
            : {
                  "--appearance-hover-focus-glyphs-override": theme.color(
                      highlightColor ?? color,
                      highlightGlyphsShade,
                  ),
                  "--appearance-active-pressed-glyphs-override": theme.color(
                      highlightColor ?? color,
                      highlightGlyphsShade,
                  ),
              }),
    } as CSSProperties;
    const content = (
        <>
            {icon ? (
                <Icon
                    src={icon}
                    width={iconSize}
                    height={iconSize}
                    data-appearance-glyph
                    style={
                        {
                            "--rotate-x": `${iconRotateX}deg`,
                            "--rotate-z": `${iconRotateZ}deg`,
                        } as CSSProperties
                    }
                    className={classNames(styles.icon, {
                        [styles.rotate]: iconRotateX || iconRotateZ,
                    })}
                />
            ) : null}
            {children !== undefined && children !== null ? (
                <Span
                    fontType={fontType}
                    shadow={variant === 'fill-translucent' && !disabled}
                    className={styles.label}
                >
                    {children}
                </Span>
            ) : null}
        </>
    );
    const nativeProps: ComponentProps<"button"> = {
        ...props,
        type,
        disabled,
        "aria-label":
            ariaLabel ??
            (!children && typeof tooltip === "string" ? tooltip : undefined),
        className: classNames(
            styles.button,
            styles[`size-${size}`],
            styles[`corners-${corners}`],
            {
                [styles[`has-icon-${size}`]]: !!icon,
                [styles[`only-icon-${size}`]]: !!icon && !children,
            },
        ),
    };
    const button =
        corners === "hexagon" ? (
            <button {...nativeProps}>{content}</button>
        ) : (
            <HudSurface
                as="button"
                {...nativeProps}
                variant={variant}
                color={color}
                highlightColor={highlightColor}
                highlighted={highlighted}
                activeGlow={activeGlow}
                data-depth={effects.depth}
                data-glyphs-glow={effects.glyphsGlow || undefined}
                interactive
                rectangle
                className={classNames(nativeProps.className, className)}
                style={{ ...style, ...appearanceOverrides }}
            >
                {content}
            </HudSurface>
        );
    const hasTooltip =
        tooltip !== null &&
        tooltip !== undefined &&
        tooltip !== false &&
        tooltip !== "";
    const buttonWithTooltip = hasTooltip ? (
        <Tooltip
            placement={tooltipPlacement}
            content={tooltip}
            color={highlightColor ?? color}
            variant={
                variant === "fill"
                    ? "fill"
                    : variant === "fill-translucent"
                      ? "fill-translucent"
                      : "fill-inverse"
            }
            showConnection={showTooltipConnection}
        >
            {button}
        </Tooltip>
    ) : (
        button
    );
    return corners === "hexagon" ? (
        <Hexagon
            shape="flat-top"
            size={size}
            variant={variant}
            activeGlow={activeGlow}
            color={color}
            highlightColor={highlightColor}
            highlighted={highlighted}
            disabled={disabled}
            interactive
            style={{ ...style, ...appearanceOverrides }}
            className={className}
        >
            {buttonWithTooltip}
        </Hexagon>
    ) : (
        buttonWithTooltip
    );
};

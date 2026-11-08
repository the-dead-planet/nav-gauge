import { Children, ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import {
    ButtonProps,
    buttonCaptionLayout,
    DEFAULT_COLOR,
    DEFAULT_HEXAGON_SHAPE,
    DEFAULT_SIZE,
    DEFAULT_SURFACE_VARIANT,
    typographyUsageSpecifications,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { Caption, Span } from "../../design-system/typography";
import { HexagonSurface } from "../../hud/hexagon/HexagonSurface";
import hexagonStyles from "../../hud/hexagon/hexagon.module.css";
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
    caption,
    captionNowrap = false,
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
    const labelChildren = Children.toArray(children).filter(
        (child) => child !== "",
    );
    const hasLabel = labelChildren.length > 0;
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
            {hasLabel ? (
                <Span fontType={fontType} className={styles.label}>
                    {labelChildren}
                </Span>
            ) : null}
        </>
    );
    const accessibleLabel =
        ariaLabel ??
        (!hasLabel && typeof tooltip === "string" ? tooltip : undefined);
    const nativeProps: ComponentProps<"button"> = {
        ...props,
        type,
        disabled,
        "aria-label": accessibleLabel,
        className: classNames(styles.button, styles[`corners-${corners}`], {
            [hexagonStyles[DEFAULT_HEXAGON_SHAPE]]: corners === "hexagon",
            [hexagonStyles["depth-inset"]]:
                corners === "hexagon" && effects.depth === "inset",
            [styles["has-icon"]]: !!icon,
            [styles["only-icon"]]: !!icon && !hasLabel,
        }),
    };
    const shapeProps = caption
        ? { className: nativeProps.className }
        : nativeProps;
    const shapedButton = (
        <HudSurface
            as={caption ? "span" : "button"}
            {...shapeProps}
            disabled={disabled}
            size={size}
            variant={variant}
            color={color}
            highlightColor={highlightColor}
            highlighted={highlighted}
            activeGlow={activeGlow}
            data-depth={effects.depth}
            data-glyphs-glow={effects.glyphsGlow || undefined}
            interactive
            rectangle={corners !== "hexagon"}
            className={classNames(nativeProps.className, className)}
            style={{ ...style, ...appearanceOverrides }}
        >
            {corners === "hexagon" ? (
                <HexagonSurface effects={effects}>{content}</HexagonSurface>
            ) : (
                content
            )}
        </HudSurface>
    );
    const captionedButton = caption ? (
        <HudSurface
            as="button"
            {...props}
            type={type}
            disabled={disabled}
            aria-label={accessibleLabel}
            variant={variant}
            color={color}
            highlightColor={highlightColor}
            highlighted={highlighted}
            interactive
            className={styles['captioned-button']}
            style={{
                ...appearanceOverrides,
                '--caption-min-height': `${captionNowrap ? typographyUsageSpecifications.caption.lineHeight : buttonCaptionLayout.minHeight}px`,
                '--caption-width': `${buttonCaptionLayout.width}px`,
                '--caption-gap': `${buttonCaptionLayout.gap}px`,
            } as CSSProperties}
        >
            {shapedButton}
            <Caption
                nowrap={captionNowrap}
                fontType={fontType}
                fontWeight={typographyUsageSpecifications.caption.fontWeight}
                className={styles.caption}
            >
                {caption}
            </Caption>
        </HudSurface>
    ) : shapedButton;
    const hasTooltip =
        tooltip !== null &&
        tooltip !== undefined &&
        tooltip !== false &&
        tooltip !== "";
    return hasTooltip ? (
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
            {captionedButton}
        </Tooltip>
    ) : (
        captionedButton
    );
};

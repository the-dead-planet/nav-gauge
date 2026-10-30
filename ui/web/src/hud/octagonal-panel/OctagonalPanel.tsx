import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getOctagonalGeometry,
    OctagonalPanelProps,
    ThemeContext,
    useTheme,
} from "@ui";
import { HudSurface } from "../HudSurface";
import { usePanelDimensions } from "../usePanelDimensions";
import { OctagonalSurface } from "./OctagonalSurface";
import styles from "./octagonal-panel.module.css";
import surface from "../surface.module.css";

interface Props {
    contentClassName?: string;
    contentStyle?: CSSProperties;
    clipContent?: boolean;
}

export const OctagonalPanel: FC<
    OctagonalPanelProps & Props & ComponentProps<"div">
> = ({
    themeMode,
    color = DEFAULT_COLOR,
    highlightColor = color,
    variant = DEFAULT_FILL_VARIANT,
    size = DEFAULT_SIZE,
    highlighted = false,
    disabled = false,
    className,
    contentClassName,
    contentStyle,
    clipContent = true,
    children,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const { containerRef, width, height } = usePanelDimensions();
    const state = disabled
        ? "disabled"
        : highlighted
          ? "active-pressed"
          : "default";
    const appearance = theme.resolveAppearance(
        variant,
        color,
        highlightColor,
        state,
    );
    const ready = width > 0 && height > 0;
    return (
        <ThemeContext.Provider value={theme}>
            <HudSurface
                as="div"
                {...props}
                ref={containerRef}
                variant={variant}
                color={color}
                highlightColor={highlightColor}
                highlighted={highlighted}
                disabled={disabled}
                className={classNames(styles.root, surface.raised, className)}
            >
                {ready ? (
                    <OctagonalSurface
                        width={width}
                        height={height}
                        size={size}
                        appearance={appearance}
                    />
                ) : null}
                <div
                    className={classNames(styles.content, contentClassName)}
                    style={{
                        ...contentStyle,
                        clipPath:
                            clipContent && ready
                                ? getOctagonalGeometry(width, height, size)
                                      .clipPath
                                : undefined,
                    }}
                >
                    {children}
                </div>
            </HudSurface>
        </ThemeContext.Provider>
    );
};

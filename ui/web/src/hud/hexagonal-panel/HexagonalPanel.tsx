import { ComponentProps, CSSProperties, FC } from "react";
import {
    HexagonalPanelProps,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    DEFAULT_HEXAGONAL_PANEL_SHAPE,
    getHexagonalPanelGeometry,
    ThemeContext,
    useTheme,
} from "@ui";
import classNames from "classnames";
import styles from "./hexagonal-panel.module.css";
import surface from "../surface.module.css";
import { useHudInteraction } from "../useHudInteraction";
import { usePanelDimensions } from "../usePanelDimensions";
import { HudSurface } from "../HudSurface";

interface Props {
    contentClassName?: string;
    contentStyle?: CSSProperties;
    clipContent?: boolean;
}

export const HexagonalPanel: FC<
    HexagonalPanelProps & Props & ComponentProps<"div">
> = ({
    themeMode,
    interactive = false,
    activeGlow = "none",
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    size = DEFAULT_SIZE,
    shape = DEFAULT_HEXAGONAL_PANEL_SHAPE,
    highlighted = false,
    disabled = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
    className,
    contentClassName,
    contentStyle,
    clipContent = true,
    children,
    ...props
}) => {
    const theme = useTheme().forMode(themeMode);
    const interaction = useHudInteraction({
        disabled,
        onClick,
        onKeyDown,
        onKeyUp,
        onBlur,
        role,
        tabIndex,
    });
    const { containerRef, width, height } = usePanelDimensions();
    const { points, clipPath } = getHexagonalPanelGeometry(
        width,
        height,
        size,
        shape,
    );
    const ready = width > 0 && height > 0;
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><polygon points="${points}" fill="white"/></svg>`)}")`;

    return (
        <ThemeContext.Provider value={theme}>
            <HudSurface
                as="div"
                {...props}
                {...interaction}
                ref={containerRef}
                variant={variant}
                color={color}
                highlightColor={highlightColor}
                interactive={interactive || !!onClick}
                highlighted={highlighted}
                disabled={disabled}
                activeGlow={activeGlow}
                className={classNames(surface.raised, className)}
            >
                {ready ? (
                    <>
                        <div
                            className={styles.backdrop}
                            style={{
                                maskImage: backdropMask,
                                WebkitMaskImage: backdropMask,
                            }}
                            aria-hidden="true"
                        />
                        <svg
                            viewBox={`0 0 ${width} ${height}`}
                            className={surface.drawing}
                            aria-hidden="true"
                        >
                            <polygon
                                points={points}
                                className={surface.glow}
                                strokeWidth={2}
                            />
                            <polygon
                                points={points}
                                className={surface.paint}
                            />
                        </svg>
                    </>
                ) : null}
                <div
                    className={classNames(styles.content, contentClassName)}
                    style={{
                        ...contentStyle,
                        clipPath: clipContent && ready ? clipPath : undefined,
                    }}
                >
                    {children}
                </div>
            </HudSurface>
        </ThemeContext.Provider>
    );
};

import { ComponentProps, CSSProperties, FC } from "react";
import classNames from "classnames";
import {
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    getNotchedPanelGeometry,
    NotchedPanelProps,
} from "@ui";
import styles from "./notched-panel.module.css";
import surface from "../surface.module.css";
import { useHudInteraction } from "../useHudInteraction";
import { usePanelDimensions } from "../usePanelDimensions";

interface Props {
    contentClassName?: string;
    contentStyle?: CSSProperties;
}

export const NotchedPanel: FC<
    NotchedPanelProps & Props & ComponentProps<"div">
> = ({
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    activeGlow = "none",
    interactive = false,
    highlighted = false,
    disabled = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onBlur,
    role,
    tabIndex,
    header,
    children,
    className,
    contentClassName,
    contentStyle,
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
    const hasHeader =
        header !== undefined &&
        header !== null &&
        header !== false &&
        header !== "";
    const { containerRef, headerRef, width, height, headerHeight } =
        usePanelDimensions(hasHeader);
    const { bodyPoints, headerPoints, stepPoints } = getNotchedPanelGeometry(
        width,
        height,
        headerHeight,
    );
    const ready = width > 0 && height > 0;
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><polygon points="${bodyPoints}" fill="white"/></svg>`)}")`;

    return (
        <div
            {...props}
            {...interaction}
            ref={containerRef}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor ?? color}
            data-interactive={interactive || !!onClick || undefined}
            data-highlighted={highlighted || undefined}
            data-disabled={disabled || undefined}
            data-glow={activeGlow}
            className={classNames(
                surface.surface,
                surface.raised,
                styles.panel,
                className,
            )}
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
                        className={surface.drawing}
                        viewBox={`0 0 ${width} ${height}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon
                            className={surface.glow}
                            points={bodyPoints}
                            strokeWidth={2}
                        />
                        <polygon
                            className={surface.paint}
                            points={bodyPoints}
                            vectorEffect="non-scaling-stroke"
                        />
                        <polyline
                            className={surface.edge}
                            points={stepPoints}
                            vectorEffect="non-scaling-stroke"
                        />
                        {hasHeader ? (
                            <polyline
                                className={surface.edge}
                                points={headerPoints}
                                vectorEffect="non-scaling-stroke"
                            />
                        ) : null}
                    </svg>
                </>
            ) : null}
            {hasHeader ? (
                <div ref={headerRef} className={styles.header}>
                    {header}
                </div>
            ) : null}
            <div
                className={classNames(styles.content, contentClassName)}
                style={contentStyle}
            >
                {children}
            </div>
        </div>
    );
};

import { ComponentProps, CSSProperties, FC } from "react";
import {
    BevelPanelProps,
    DEFAULT_FILL_VARIANT,
    DEFAULT_COLOR,
    DEFAULT_SIZE,
    getBevelPanelGeometry,
} from "@ui";
import classNames from "classnames";
import styles from "./bevel-panel.module.css";
import surface from "../surface.module.css";
import { useHudInteraction } from "../useHudInteraction";
import { usePanelDimensions } from "../usePanelDimensions";

interface Props {
    contentClassName?: string;
    contentStyle?: CSSProperties;
    clipContent?: boolean;
}

export const BevelPanel: FC<
    BevelPanelProps & Props & ComponentProps<"div">
> = ({
    interactive = false,
    activeGlow = "none",
    color = DEFAULT_COLOR,
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    size = DEFAULT_SIZE,
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
    const { points, clipPath } = getBevelPanelGeometry(width, height, size);
    const ready = width > 0 && height > 0;
    const backdropMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><polygon points="${points}" fill="white"/></svg>`)}")`;

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
            className={classNames(surface.surface, surface.raised, className)}
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
                        <polygon points={points} className={surface.paint} />
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
        </div>
    );
};

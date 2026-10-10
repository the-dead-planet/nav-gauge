import { ComponentProps, CSSProperties, FC, useEffect, useId, useRef, useState } from "react";
import { BevelPanelProps, SizeVariant, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./bevel-panel.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
    contentClassName?: string;
    contentStyle?: CSSProperties;
    clipContent?: boolean;
}

const bevelMap: Record<SizeVariant, number> = {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
};

export const BevelPanel: FC<BevelPanelProps & Props & ComponentProps<'div'>> = ({
    interactive = false,
    glowStyle = "none",
    color = 'neutral',
    highlightColor,
    variant,
    size = 'lg',
    active = false,
    disabled = false,
    onClick,
    className,
    style,
    contentClassName,
    contentStyle,
    clipContent = true,
    children,
    ...props
}) => {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const filterId = useId();

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }

        const updateSize = () => {
            setDimensions({ width: element.offsetWidth, height: element.offsetHeight });
        };

        updateSize();
        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    const strokeWidth = variant === 'fill' ? 0 : 1;
    const strokeInset = strokeWidth / 2;
    const bevel = bevelMap[size];
    const effectiveBevel = dimensions.width > 0 ? Math.min(bevel, dimensions.width / 2 - 1) : bevel;
    const points = dimensions.width > 0 && dimensions.height > 0
        ? `${effectiveBevel},${strokeInset} ${dimensions.width - effectiveBevel},${strokeInset} ${dimensions.width - strokeInset},${dimensions.height / 2} ${dimensions.width - effectiveBevel},${dimensions.height - strokeInset} ${effectiveBevel},${dimensions.height - strokeInset} ${strokeInset},${dimensions.height / 2}`
        : '';
    const clipPath = `polygon(${effectiveBevel}px 0, calc(100% - ${effectiveBevel}px) 0, 100% 50%, calc(100% - ${effectiveBevel}px) 100%, ${effectiveBevel}px 100%, 0 50%)`;
    const backdropMask = points
        ? `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimensions.width} ${dimensions.height}"><polygon points="${points}" fill="white"/></svg>`)}")`
        : undefined;

    return (
        <div
            ref={containerRef}
            onClick={disabled ? undefined : onClick}
            aria-disabled={!disabled || !(interactive || onClick) ? undefined : true}
            className={classNames(
                styles['bevel-panel'],
                variant && styles[`variant-${variant}`],
                styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${theme.mode}`],
                {
                    [styles.active]: active && !disabled,
                    [styles.disabled]: disabled,
                    [styles.interactive]: !disabled && (interactive || onClick),
                    [styles[`glow-style-${glowStyle}`]]: !disabled && interactive,
                },
                className,
            )}
            style={{ ...style, '--bevel-filter': `url(#${filterId})` } as CSSProperties}
            {...props}
        >
            {variant === 'fill-translucent' && points ? (
                <div
                    className={styles.backdrop}
                    style={{
                        maskImage: backdropMask,
                        WebkitMaskImage: backdropMask,
                        maskSize: '100% 100%',
                        WebkitMaskSize: '100% 100%',
                    }}
                />
            ) : null}
            {points ? (
                <svg viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} className={styles.svg}>
                    <defs>
                        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                            <feMerge>
                                <feMergeNode in="blur2" />
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <polygon points={points} fill="none" strokeWidth={strokeWidth} className={styles['polygon-base']} />
                    <polygon points={points} fill="none" strokeWidth={2} className={styles['polygon-glow']} />
                </svg>
            ) : null}
            <div
                className={classNames(styles.content, contentClassName)}
                style={{
                    ...contentStyle,
                    clipPath: clipContent && points ? clipPath : undefined,
                } as CSSProperties}
            >
                {children}
            </div>
        </div>
    );
};

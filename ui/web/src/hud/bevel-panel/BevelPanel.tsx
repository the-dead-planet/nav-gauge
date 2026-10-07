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

const paddingVertical: Record<SizeVariant, number> = {
    xs: 5,
    sm: 10,
    md: 15,
};

export const BevelPanel: FC<BevelPanelProps & Props & ComponentProps<'div'>> = ({
    bevel = 20,
    interactive = false,
    glowStyle = "none",
    color = 'neutral',
    highlightColor,
    variant,
    padding,
    themeMode,
    active = false,
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
    const effectiveMode = themeMode ?? theme.mode;
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const filterId = useId();

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return;
        }

        const updateSize = () => {
            setSize({ width: element.offsetWidth, height: element.offsetHeight });
        };

        updateSize();
        const resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, []);

    const strokeWidth = variant === 'fill' ? 0 : 1;
    const strokeInset = strokeWidth / 2;
    const effectiveBevel = size.width > 0 ? Math.min(bevel, size.width / 2 - 1) : bevel;
    const points = size.width > 0 && size.height > 0
        ? `${effectiveBevel},${strokeInset} ${size.width - effectiveBevel},${strokeInset} ${size.width - strokeInset},${size.height / 2} ${size.width - effectiveBevel},${size.height - strokeInset} ${effectiveBevel},${size.height - strokeInset} ${strokeInset},${size.height / 2}`
        : '';
    const clipPath = `polygon(${effectiveBevel}px 0, calc(100% - ${effectiveBevel}px) 0, 100% 50%, calc(100% - ${effectiveBevel}px) 100%, ${effectiveBevel}px 100%, 0 50%)`;
    const backdropMask = points
        ? `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size.width} ${size.height}"><polygon points="${points}" fill="white"/></svg>`)}")`
        : undefined;

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className={classNames(
                styles['bevel-panel'],
                variant && styles[`variant-${variant}`],
                styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${effectiveMode}`],
                {
                    [styles.active]: active,
                    [styles.interactive]: interactive || onClick,
                    [styles[`glow-style-${glowStyle}`]]: interactive,
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
                <svg viewBox={`0 0 ${size.width} ${size.height}`} className={styles.svg}>
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
                    paddingTop: padding ? paddingVertical[padding] : 0,
                    paddingBottom: padding ? paddingVertical[padding] : 0,
                    paddingLeft: effectiveBevel,
                    paddingRight: effectiveBevel,
                } as CSSProperties}
            >
                {children}
            </div>
        </div>
    );
};

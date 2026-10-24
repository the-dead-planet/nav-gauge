import { ComponentProps, CSSProperties, FC, RefObject } from "react";
import { DEFAULT_FILL_VARIANT, PanelProps, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./panel.module.css";

interface Props {
    forwardRef?: RefObject<HTMLDivElement | null>;
    className?: string;
    style?: CSSProperties;
}

export const Panel: FC<PanelProps & Props & ComponentProps<'div'>> = ({
    shape,
    interactive = false,
    activeGlow = "none",
    color = 'neutral',
    highlightColor,
    variant = DEFAULT_FILL_VARIANT,
    borderWidth = 2,
    highlighted = false,
    disabled = false,
    onClick,
    forwardRef,
    className,
    style = {},
    children,
    ...props
}) => {
    const theme = useTheme();

    return (
        <div
            ref={forwardRef}
            onClick={disabled ? undefined : onClick}
            aria-disabled={!disabled || !(interactive || onClick) ? undefined : true}
            className={classNames(
                styles.panel,
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${theme.mode}`],
                {
                    [styles[shape ?? '']]: !!shape,
                    [styles['highlighted']]: highlighted && !disabled,
                    [styles['disabled']]: disabled,
                    [styles['interactive']]: !disabled && (interactive || onClick),
                    [styles[`glow-style-${activeGlow}`]]: !disabled && interactive,
                },
                className
            )}
            style={{
                '--border-width': `${borderWidth}px`,
                ...style
            } as CSSProperties}
            {...props}
        >
            {children}
        </div>
    );
};

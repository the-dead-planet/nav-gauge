import { ComponentProps, CSSProperties, FC } from "react";
import { PanelProps, useTheme } from "@ui";
import classNames from "classnames";
import styles from "./panel.module.css";

interface Props {
    className?: string;
    style?: CSSProperties;
}

export const Panel: FC<PanelProps & Props & ComponentProps<'div'>> = ({
    shape,
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
    children,
    ...props
}) => {
    const theme = useTheme();
    const effectiveMode = themeMode !== undefined ? (themeMode ? 'dark' : 'light') : theme.mode;

    return (
        <div
            onClick={onClick}
            className={classNames(
                styles.panel,
                variant && styles[`variant-${variant}`],
                color && styles[`color-${color}`],
                styles[`highlight-color-${highlightColor || color}`],
                styles[`mode-${effectiveMode}`],
                {
                    [styles[shape ?? '']]: !!shape,
                    [styles[`padding-${padding}`]]: !!padding,
                    [styles['active']]: active,
                    [styles['interactive']]: interactive || onClick,
                    [styles[`glow-style-${glowStyle}`]]: interactive,
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

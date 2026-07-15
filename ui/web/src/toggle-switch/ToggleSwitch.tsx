import { ChangeEvent, ComponentProps, FC, useId } from "react";
import classNames from "classnames";
import { ToggleSwitchProps, useTheme } from "@ui";
import styles from './toggle-switch.module.css';

interface Props {
    labelledBy?: string;
}

export const ToggleSwitch: FC<Omit<ComponentProps<'label'>, 'onChange'> & ToggleSwitchProps & Props> = ({
    id,
    labelledBy,
    color = 'neutral',
    highlightColor = color,
    size = 'sm',
    variant = 'ghost',
    glowStyle = 'none',
    orientation = 'horizontal',
    checked,
    onChange,
    disabled = false,
    children,
    className,
    style,
    ...props
}) => {
    const generatedId = useId();
    const effectiveId = id || generatedId;
    const theme = useTheme();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === 'Enter' && !disabled) {
            e.preventDefault();
            onChange(!checked);
        }
    };

    return (
        <label
            onKeyDown={handleKeyDown}
            aria-labelledby={labelledBy}
            htmlFor={effectiveId}
            className={classNames(
                styles['toggle-switch'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                styles[`orientation-${orientation}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['checked']]: checked,
                },
                className
            )}
            style={style}
            {...props}
        >
            <input
                id={effectiveId}
                type="checkbox"
                className={styles['input']}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
            />
            <span className={classNames(styles['lamp'], styles['lamp-off'], checked ? styles['lamp-inactive'] : styles['lamp-error'])} />
            <span className={styles['track']}>
                <span className={styles['thumb']}>
                    <span className={styles['thumb-pivot']} />
                    <span className={styles['thumb-knob']} />
                </span>
            </span>
            <span className={classNames(styles['lamp'], styles['lamp-on'], checked ? styles['lamp-success'] : styles['lamp-inactive'])} />
            {children ? <span className={styles['label']}>{children}</span> : null}
        </label>
    );
};

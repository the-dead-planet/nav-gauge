import { ChangeEvent, ComponentProps, FC, useId } from "react";
import classNames from "classnames";
import { ToggleSwitchProps, useTheme } from "@ui";
import styles from './toggle-switch.module.css';
import { Span } from "../typography";
import { Lamp } from "./Lamp";

interface Props {
    labelledBy?: string;
}

export const ToggleSwitch: FC<Omit<ComponentProps<'label'>, 'onChange'> & ToggleSwitchProps & Props> = ({
    id,
    label,
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
            {typeof label === 'string' ? (
                <Span className={styles['label']}>
                    {label}
                </Span>
            ) : label}
            <span className={classNames(styles['toggle-row'], styles[`orientation-${orientation}`])}>
                <Lamp variant="off" active={!checked} />
                <span className={styles['track']}>
                    <span className={styles['thumb']}>
                        <span className={styles['thumb-pivot']} />
                        <span className={styles['thumb-body']} />
                        <span className={styles['thumb-knob']} />
                    </span>
                </span>
                <Lamp variant="on" active={checked} />
            </span>
        </label>
    );
};

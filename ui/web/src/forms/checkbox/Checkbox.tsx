import { ChangeEvent, ComponentProps, FC, useId } from "react";
import classNames from "classnames";
import { CheckboxProps, useTheme } from "@ui";
import styles from './checkbox.module.css';

interface Props {
    labelledBy?: string;
}

export const Checkbox: FC<Omit<ComponentProps<'label'>, 'onChange'> & CheckboxProps & Props> = ({
    id,
    labelledBy,
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    variant = 'fill',
    size = 'sm',
    checked,
    active = false,
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
                styles['checkbox'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor}`],
                styles[`variant-${variant}`],
                styles[`size-${size}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['checked']]: checked || (active && !disabled),
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
            <span className={classNames(styles['box'], { [styles['box-checked']]: checked || (active && !disabled) })}>
                {checked ? (
                    <svg className={styles['checkmark']} viewBox="0 0 12 12" width="12" height="12" aria-hidden>
                        <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : null}
            </span>
            {children ? <span className={styles['label']} style={(checked || active ? highlightContentShade : contentShade) === undefined ? undefined : { color: theme.color(checked || active ? highlightColor : color, checked || active ? highlightContentShade : contentShade) }}>{children}</span> : null}
        </label>
    );
};

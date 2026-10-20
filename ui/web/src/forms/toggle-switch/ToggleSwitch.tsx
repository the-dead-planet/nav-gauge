import { ChangeEvent, ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import { DEFAULT_FILL_VARIANT, DEFAULT_SIZE, ToggleSwitchProps, useTheme } from "@ui";
import styles from './toggle-switch.module.css';
import { Lamp } from "./Lamp";

interface Props extends ToggleSwitchProps {
    labelledBy?: string;
}

export const ToggleSwitch: FC<Omit<ComponentProps<'label'>, 'onChange'> & Props> = ({
    id,
    label,
    labelledBy,
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    orientation = 'horizontal',
    checked,
    onChange,
    disabled = false,
    active = false,
    className,
    style,
    children,
    ...props
}) => {
    const generatedId = useId();
    const effectiveId = id || generatedId;
    const theme = useTheme();
    const content = label ?? children;

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
                styles[`size-${size}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['checked']]: checked,
                    [styles['active']]: active && !disabled,
                },
                className
            )}
            style={{
                ...style,
                ...(contentShade === undefined ? undefined : {
                    '--appearance-default-glyphs-override': theme.color(color, contentShade),
                }),
                ...(highlightContentShade === undefined ? undefined : {
                    '--appearance-interaction-glyphs-override': theme.color(highlightColor, highlightContentShade),
                    '--appearance-active-glyphs-override': theme.color(highlightColor, highlightContentShade),
                }),
            } as CSSProperties}
            data-appearance-variant={variant}
            data-appearance-color={color}
            data-appearance-highlight={highlightColor}
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
            {typeof content === 'string' || typeof content === 'number' ? (
                <span className={styles['label']}>
                    {content}
                </span>
            ) : content}
            <span className={classNames(styles['toggle-row'], styles[`orientation-${orientation}`])}>
                <Lamp isSwitchedOn={false} active={!checked} />
                <span className={styles['track']}>
                    <span
                        className={styles['thumb']}
                        data-appearance-variant="fill"
                        data-appearance-color={color}
                        data-appearance-highlight={highlightColor}
                    >
                        <span className={styles['thumb-pivot']} />
                        <span className={styles['thumb-body']} />
                        <span className={styles['thumb-knob']} />
                    </span>
                </span>
                <Lamp isSwitchedOn={true} active={checked} />
            </span>
        </label>
    );
};

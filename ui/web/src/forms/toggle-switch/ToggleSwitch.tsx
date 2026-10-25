import { ChangeEvent, ComponentProps, CSSProperties, FC, useId } from "react";
import classNames from "classnames";
import { DEFAULT_COLOR, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, ToggleSwitchProps, useTheme } from "@ui";
import styles from './toggle-switch.module.css';
import { Lamp } from "./Lamp";

interface Props extends ToggleSwitchProps {
    labelledBy?: string;
}

export const ToggleSwitch: FC<Omit<ComponentProps<'label'>, 'onChange'> & Props> = ({
    id,
    label,
    labelledBy,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    orientation = 'horizontal',
    checked,
    onChange,
    disabled = false,
    highlighted = false,
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
                    [styles['highlighted']]: highlighted && !disabled,
                },
                className
            )}
            style={{
                ...style,
                ...(glyphsShade === undefined ? undefined : {
                    '--appearance-default-glyphs-override': theme.color(color, glyphsShade),
                }),
                ...(highlightGlyphsShade === undefined ? undefined : {
                    '--appearance-hover-focus-glyphs-override': theme.color(highlightColor, highlightGlyphsShade),
                    '--appearance-active-pressed-glyphs-override': theme.color(highlightColor, highlightGlyphsShade),
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
                <Lamp isSwitchedOn={false} highlighted={!checked} />
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
                <Lamp isSwitchedOn={true} highlighted={checked} />
            </span>
        </label>
    );
};

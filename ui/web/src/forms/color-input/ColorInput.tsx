import { ChangeEvent, ComponentProps, FC, useRef, useState } from "react";
import classNames from "classnames";
import { ColorFormat, ColorInputProps, DropdownOption, parseColor, toHexColor, useColorInputState, useTheme } from "@ui";
import { Label } from "../../typography";
import { Popup } from "../../popup";
import { Dropdown } from "../../dropdown";
import { ColorButton } from "../color-button";
import { ColorRamp } from "../color-ramp";
import styles from './color-input.module.css';

const formatOptions: DropdownOption<ColorFormat>[] = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'rgba', label: 'RGBA' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsla', label: 'HSLA' },
];

export const ColorInput: FC<Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'type' | 'size'> & ColorInputProps> = ({
    id,
    color = 'neutral',
    contentShade,
    highlightColor = color,
    highlightContentShade,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    active = false,
    showColorButton = true,
    showValueInput = true,
    showFormatSelect = false,
    className,
    ...props
}) => {
    const theme = useTheme();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const { draft, format, invalid, changeDraft, changeFormat, changeColor } = useColorInputState(value, onChange);

    const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
        changeColor(event.target.value);
    };

    const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
        changeDraft(event.target.value);
    };

    return (
        <>
            <div className={classNames(
                styles.container,
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                active && !disabled && styles.active,
            )}>
                <Label htmlFor={id} color={color} shade={contentShade} className={styles.label}>{label}</Label>
                <div className={classNames(styles['input-wrapper'], { [styles.invalid]: invalid })}>
                    {showColorButton ? (
                        <ColorButton
                            ref={anchorRef}
                            value={value}
                            label={label}
                            size={size}
                            selected={open || active}
                            className={styles.swatch}
                            aria-haspopup="dialog"
                            aria-expanded={open}
                            onClick={() => setOpen((current) => !current)}
                            disabled={disabled}
                        />
                    ) : null}
                    {showValueInput && showFormatSelect ? (
                        <Dropdown
                            value={format}
                            options={formatOptions}
                            size={size}
                            variant={variant}
                            color={color}
                            highlightColor={highlightColor}
                            contentShade={contentShade}
                            highlightContentShade={highlightContentShade}
                            disabled={disabled}
                            ariaLabel={`${label} format`}
                            className={styles['format-select']}
                            onChange={changeFormat}
                        />
                    ) : null}
                    {showValueInput ? (
                        <input
                            id={id}
                            type="text"
                            value={draft}
                            disabled={disabled}
                            aria-invalid={invalid}
                            className={classNames(styles['value-input'], className)}
                            style={contentShade === undefined ? undefined : { color: theme.color(color, contentShade) }}
                            onChange={handleDraftChange}
                            {...props}
                        />
                    ) : null}
                    <input
                        type="color"
                        value={toHexColor(parseColor(value))}
                        onChange={handleNativeChange}
                        disabled={disabled}
                        aria-label={`${label} native picker`}
                        className={styles['native-picker']}
                    />
                </div>
            </div>
            {showColorButton ? (
                <Popup
                    visible={open}
                    anchor={anchorRef}
                    variant="fill-inverse"
                    triggerAnchor="bottom-left"
                    popupAnchor="top-left"
                    onClose={() => setOpen(false)}
                    popupClassName={styles.popup}
                >
                    <div role="dialog" aria-label={label}>
                        <ColorRamp
                            value={value}
                            label={label}
                            size={size}
                            disabled={disabled}
                            onChange={changeColor}
                        />
                    </div>
                </Popup>
            ) : null}
        </>
    );
};

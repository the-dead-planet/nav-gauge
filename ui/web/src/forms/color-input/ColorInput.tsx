import { ChangeEvent, ComponentProps, FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ColorFormat, ColorInputProps, DropdownOption, formatColor, parseColor, toHexColor, tryParseColor, useTheme } from "@ui";
import { Label } from "../../typography";
import { Popup } from "../../popup";
import { Dropdown } from "../../dropdown";
import { ColorButton } from "../color-button";
import { ColorRamp } from "../color-picker/ColorRamp";
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
    highlightColor = color,
    size = 'sm',
    variant = 'fill-inverse',
    label,
    value,
    onChange,
    disabled = false,
    showColorButton = true,
    showValueInput = true,
    showFormatSelect = false,
    className,
    ...props
}) => {
    const theme = useTheme();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const parsedValue = tryParseColor(value);
    const [format, setFormat] = useState<ColorFormat>(parsedValue?.format ?? 'hex');
    const [draft, setDraft] = useState(value);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        const nextParsedValue = tryParseColor(value);
        setDraft(value);
        setInvalid(false);
        if (nextParsedValue) setFormat(nextParsedValue.format);
    }, [value]);

    const handleNativeChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(formatColor(parseColor(event.target.value), format));
    };

    const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextDraft = event.target.value;
        const nextParsedValue = tryParseColor(nextDraft);
        setDraft(nextDraft);
        setInvalid(!nextParsedValue);
        if (nextParsedValue) {
            setFormat(nextParsedValue.format);
            onChange(nextDraft);
        }
    };

    const handleFormatChange = (nextFormat: ColorFormat) => {
        const color = tryParseColor(draft)?.color ?? parseColor(value);
        const nextValue = formatColor(color, nextFormat);
        setFormat(nextFormat);
        setDraft(nextValue);
        setInvalid(false);
        onChange(nextValue);
    };

    const handleRampChange = (nextValue: string) => {
        const nextColor = parseColor(nextValue);
        const nextFormat = nextColor.a < 1
            ? format === 'hsl' || format === 'hsla' ? 'hsla' : 'rgba'
            : format;
        onChange(formatColor(nextColor, nextFormat));
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
            )}>
                <Label htmlFor={id} className={styles.label}>{label}</Label>
                <div className={classNames(styles['input-wrapper'], { [styles.invalid]: invalid })}>
                    {showColorButton ? (
                        <ColorButton
                            ref={anchorRef}
                            value={value}
                            label={label}
                            size={size}
                            selected={open}
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
                            disabled={disabled}
                            ariaLabel={`${label} format`}
                            className={styles['format-select']}
                            onChange={handleFormatChange}
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
                            onChange={handleRampChange}
                        />
                    </div>
                </Popup>
            ) : null}
        </>
    );
};

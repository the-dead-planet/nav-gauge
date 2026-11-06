import {
    ChangeEvent,
    ComponentProps,
    CSSProperties,
    FC,
    useId,
    useRef,
    useState,
} from "react";
import classNames from "classnames";
import {
    colorFormatOptions,
    ColorInputProps,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    useColorInputState,
    useTheme,
} from "@ui";
import { Label } from "../../design-system/typography";
import { Popup } from "../../rigs/popup";
import { Dropdown } from "../dropdown";
import { ColorButton } from "../color-button";
import { ColorRamp } from "../color-ramp";
import styles from "./color-input.module.css";

export const ColorInput: FC<
    Omit<ComponentProps<"input">, "onChange" | "value" | "type" | "size"> &
        ColorInputProps
> = ({
    id,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor = color,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    label,
    value,
    onChange,
    disabled = false,
    highlighted = false,
    showColorButton = true,
    showValueInput = true,
    showFormatSelect = false,
    className,
    style,
    ...props
}) => {
    const theme = useTheme();
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const { draft, format, invalid, changeDraft, changeFormat, changeColor } =
        useColorInputState(value, onChange);

    const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
        changeDraft(event.target.value);
    };

    return (
        <>
            <div className={styles.container} data-size={size}>
                <Label
                    htmlFor={showValueInput ? inputId : `${inputId}-swatch`}
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    highlighted={highlighted}
                    disabled={disabled}
                    className={styles.label}
                >
                    {label}
                </Label>
                <div
                    className={styles["input-wrapper"]}
                    data-appearance-mode={theme.mode}
                    data-appearance-variant={variant}
                    data-appearance-color={color}
                    data-appearance-highlight={highlightColor}
                    data-highlighted={highlighted || undefined}
                    data-disabled={disabled || undefined}
                    data-invalid={invalid || undefined}
                    style={
                        {
                            "--appearance-default-glyphs-override":
                                glyphsShade === undefined
                                    ? undefined
                                    : theme.color(color, glyphsShade),
                            "--appearance-hover-focus-glyphs-override":
                                highlightGlyphsShade === undefined
                                    ? undefined
                                    : theme.color(
                                          highlightColor,
                                          highlightGlyphsShade,
                                      ),
                            "--appearance-active-pressed-glyphs-override":
                                highlightGlyphsShade === undefined
                                    ? undefined
                                    : theme.color(
                                          highlightColor,
                                          highlightGlyphsShade,
                                      ),
                        } as CSSProperties
                    }
                >
                    {showColorButton ? (
                        <ColorButton
                            ref={anchorRef}
                            id={`${inputId}-swatch`}
                            value={value}
                            label={label}
                            size={size}
                            selected={open || highlighted}
                            className={styles.swatch}
                            aria-haspopup="dialog"
                            aria-expanded={open && !disabled}
                            onClick={() => setOpen((current) => !current)}
                            disabled={disabled}
                        />
                    ) : null}
                    {showValueInput && showFormatSelect ? (
                        <Dropdown
                            value={format}
                            options={colorFormatOptions}
                            size={size}
                            variant={variant}
                            color={color}
                            highlightColor={highlightColor}
                            glyphsShade={glyphsShade}
                            highlightGlyphsShade={highlightGlyphsShade}
                            disabled={disabled}
                            highlighted={highlighted}
                            ariaLabel={`${label} format`}
                            className={styles["format-select"]}
                            onChange={changeFormat}
                        />
                    ) : null}
                    {showValueInput ? (
                        <input
                            {...props}
                            id={inputId}
                            type="text"
                            value={draft}
                            disabled={disabled}
                            aria-invalid={invalid}
                            className={classNames(
                                styles["value-input"],
                                className,
                            )}
                            style={style}
                            onChange={handleDraftChange}
                        />
                    ) : null}
                </div>
            </div>
            {showColorButton ? (
                <Popup
                    visible={open && !disabled}
                    anchor={anchorRef}
                    color={color}
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

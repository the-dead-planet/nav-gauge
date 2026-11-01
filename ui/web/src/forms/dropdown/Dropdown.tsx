import { ComponentProps, CSSProperties } from "react";
import classNames from "classnames";
import {
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    DropdownProps,
    Icons,
    ThemeContext,
    useTheme,
} from "@ui";
import { Icon } from "../../design-system/icons";
import { HudSurface } from "../../hud/HudSurface";
import { DropdownList } from "./DropdownList";
import { useDropdown } from "./useDropdown";
import styles from "./dropdown.module.css";

interface Props {
    ariaLabel?: string;
    labelledBy?: string;
    popoverClassName?: string;
}

export function Dropdown<T = string>({
    themeMode,
    color = DEFAULT_COLOR,
    glyphsShade,
    highlightColor,
    highlightGlyphsShade,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    value,
    options,
    onChange,
    placeholder = "Select...",
    disabled = false,
    highlighted = false,
    ariaLabel,
    labelledBy,
    popoverClassName,
    className,
    style,
    ...props
}: DropdownProps<T> & Props & Omit<ComponentProps<"div">, "onChange">) {
    const theme = useTheme().forMode(themeMode);
    const {
        isOpen,
        listId,
        triggerRef,
        listRef,
        positionStyle,
        close,
        onTriggerKeyDown,
        toggle,
    } = useDropdown(disabled);
    const selectedOption = options.find((option) => option.value === value);
    const iconSize = theme.sizes.control[size].iconSize;
    const appearanceOverrides = {
        ...(glyphsShade === undefined
            ? undefined
            : {
                  "--appearance-default-glyphs-override": theme.color(
                      color,
                      glyphsShade,
                  ),
              }),
        ...(highlightGlyphsShade === undefined
            ? undefined
            : {
                  "--appearance-hover-focus-glyphs-override": theme.color(
                      highlightColor ?? color,
                      highlightGlyphsShade,
                  ),
                  "--appearance-active-pressed-glyphs-override": theme.color(
                      highlightColor ?? color,
                      highlightGlyphsShade,
                  ),
              }),
    } as CSSProperties;

    return (
        <ThemeContext.Provider value={theme}>
            <div
                {...props}
                className={classNames(styles["dropdown-select"], className)}
                style={style}
            >
                <HudSurface
                    as="button"
                    id={`${listId}-trigger`}
                    ref={triggerRef}
                    type="button"
                    className={styles.trigger}
                    size={size}
                    variant={variant}
                    color={color}
                    highlightColor={highlightColor}
                    highlighted={highlighted || isOpen}
                    disabled={disabled}
                    interactive
                    rectangle
                    style={appearanceOverrides}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? listId : undefined}
                    aria-label={ariaLabel}
                    aria-labelledby={labelledBy}
                    onClick={toggle}
                    onKeyDown={onTriggerKeyDown}
                >
                    {selectedOption?.selectedPrepend ?? selectedOption?.prepend}
                    {selectedOption?.icon ? (
                        <Icon
                            src={selectedOption.icon}
                            width={iconSize}
                            height={iconSize}
                            className={styles.icon}
                        />
                    ) : null}
                    <span className={styles.label}>
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <Icon
                        src={Icons.NounProject.ChevronDownDoubleSquareFill}
                        width={iconSize}
                        height={iconSize}
                        className={classNames(styles.icon, styles.arrow, {
                            [styles["arrow-open"]]: isOpen,
                        })}
                    />
                </HudSurface>
                {isOpen ? (
                    <DropdownList
                        id={listId}
                        triggerRef={triggerRef}
                        listRef={listRef}
                        positionStyle={positionStyle}
                        onClose={close}
                        className={popoverClassName}
                        iconSize={iconSize}
                        color={color}
                        highlightColor={highlightColor}
                        appearanceOverrides={appearanceOverrides}
                        size={size}
                        value={value}
                        options={options}
                        onChange={onChange}
                    />
                ) : null}
            </div>
        </ThemeContext.Provider>
    );
}

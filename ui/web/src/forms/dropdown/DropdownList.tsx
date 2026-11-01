import classNames from "classnames";
import { CSSProperties, RefObject } from "react";
import { createPortal } from "react-dom";
import { DropdownProps, DEFAULT_COLOR, DEFAULT_SIZE } from "@ui";
import { Icon } from "../../design-system/icons";
import { HudSurface } from "../../hud/HudSurface";
import { MenuList } from "../../rigs/menu/MenuList";
import { useDropdownList } from "./useDropdownList";
import styles from "./dropdown.module.css";

interface Props {
    className?: string;
    id: string;
    iconSize: number;
    onClose: (restoreFocus?: boolean) => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
    appearanceOverrides: CSSProperties;
    listRef: RefObject<HTMLUListElement | null>;
    positionStyle: CSSProperties;
}

export function DropdownList<T = string>({
    className,
    onClose,
    id,
    triggerRef,
    listRef,
    positionStyle,
    color = DEFAULT_COLOR,
    appearanceOverrides,
    iconSize,
    value,
    options,
    onChange,
    size = DEFAULT_SIZE,
    highlightColor,
}: Props &
    Pick<
        DropdownProps<T>,
        "value" | "options" | "color" | "highlightColor" | "size" | "onChange"
    >) {
    const { select, onKeyDown, setActiveIndex } = useDropdownList({
        value,
        options,
        onChange,
        listRef,
        visible: positionStyle.visibility === "visible",
        onClose,
    });

    return createPortal(
        <MenuList
            as="ul"
            color={color}
            size={size}
            id={id}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={classNames(styles[`size-${size}`], className)}
            style={positionStyle}
            data-popup-trigger-id={triggerRef.current?.id || undefined}
            onKeyDown={onKeyDown}
            aria-labelledby={triggerRef.current?.id}
        >
            {options.map((option, index) => (
                <HudSurface
                    as="li"
                    variant="menu-item"
                    color={color}
                    highlightColor={highlightColor}
                    highlighted={option.value === value}
                    interactive
                    rectangle
                    style={appearanceOverrides}
                    key={String(option.value)}
                    id={`${id}-option-${index}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={option.value === value}
                    className={styles.option}
                    onMouseMove={() => setActiveIndex(index)}
                    onClick={() => {
                        select(index);
                    }}
                >
                    {option.prepend}
                    {option.icon ? (
                        <Icon
                            src={option.icon}
                            width={iconSize}
                            height={iconSize}
                            className={styles["icon"]}
                        />
                    ) : null}
                    <span>{option.label}</span>
                </HudSurface>
            ))}
        </MenuList>,
        document.body,
    );
}

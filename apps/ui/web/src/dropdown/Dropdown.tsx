import { ComponentProps, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DropdownOption, DropdownProps, useTheme } from "@ui";
import { Icon } from "../icons";
import { Icons } from "@ui";
import { Span } from "../typography";
import styles from './dropdown.module.css';

const ICON_SIZES: Record<string, number> = {
    xs: 12,
    sm: 16,
    md: 20,
};

interface Props  {
    labelledBy?: string;
}

export function Dropdown<T = string>({
    color = 'neutral',
    highlightColor,
    size = 'sm',
    variant = 'fill-inverse',
    value,
    options,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    labelledBy,
    className,
    style,
    ...props
}: DropdownProps<T> & Props & Omit<ComponentProps<'div'>, 'onChange'>) {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);
    const iconSize = ICON_SIZES[size];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (option: DropdownOption<T>) => {
        onChange?.(option.value);
        setIsOpen(false);
    };

    return (
        <div
            ref={containerRef}
            className={classNames(
                styles['dropdown-select'],
                styles[`mode-${theme.mode}`],
                styles[`color-${color}`],
                styles[`highlight-${highlightColor || color}`],
                styles[`size-${size}`],
                styles[`variant-${variant}`],
                {
                    [styles['disabled']]: disabled,
                    [styles['open']]: isOpen,
                },
                className
            )}
            style={style}
            {...props}
        >
            <button
                type="button"
                className={styles['trigger']}
                aria-haspopup="listbox"
                aria-labelledby={labelledBy}
                disabled={disabled}
                onClick={disabled ? undefined : (() => setIsOpen(!isOpen))}
            >
                {selectedOption ? (
                    <>
                        {selectedOption.icon ? (
                            <Icon
                                src={selectedOption.icon}
                                width={iconSize}
                                height={iconSize}
                                className={styles['icon']}
                            />
                        ) : null}
                        <span className={styles['label']}>{selectedOption.label}</span>
                    </>
                ) : (
                    <span className={styles['placeholder']}>{placeholder}</span>
                )}
                <Icon
                    src={Icons.NounProject.ChevronDownDoubleSquareFill}
                    width={iconSize}
                    height={iconSize}
                    className={classNames(styles['icon'], styles['arrow'], {
                        [styles['arrow-open']]: isOpen
                    })}
                />
            </button>

            {isOpen ? (
                <ul role="listbox" className={styles['menu']}>
                    {options.map((option) => (
                        <li
                            key={String(option.value)}
                            role="option"
                            className={classNames(
                                styles['option'],
                                {
                                    [styles['option-selected']]: option.value === value,
                                }
                            )}
                            onClick={() => { handleSelect(option); }}
                        >
                            {option.icon ? (
                                <Icon
                                    src={option.icon}
                                    width={iconSize}
                                    height={iconSize}
                                    className={styles['icon']}
                                />
                            ) : null}
                            <Span color={color}>
                                {option.label}
                            </Span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

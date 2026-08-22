import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { DropdownOption, DropdownProps } from "@ui";
import { Icon } from "../icons";
import { Span } from "../typography";
import styles from './dropdown.module.css';

interface Props {
    iconSize: number;
    onClose: () => void;
}

export function DropdownList<T = string>({
    onClose,
    iconSize,
    value,
    options,
    onChange,
}: Props & Pick<DropdownProps<T>, 'value' | 'options' | 'onChange'>) {
    const listRef = useRef<HTMLUListElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState(() => {
        const idx = options.findIndex((o) => o.value === value);
        return idx >= 0 ? idx : 0;
    });

    useEffect(() => {
        listRef.current?.focus();
    }, []);

    const handleSelect = (option: DropdownOption<T>) => {
        onChange?.(option.value);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                break;
            case 'Home':
                e.preventDefault();
                setHighlightedIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setHighlightedIndex(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (options[highlightedIndex]) {
                    handleSelect(options[highlightedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
            case 'Tab':
                e.preventDefault();
                onClose();
                break;
        }
    };

    return (
        <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={styles['menu']}
            onKeyDown={handleKeyDown}
            aria-activedescendant={`dropdown-option-${highlightedIndex}`}
        >
            {options.map((option, index) => (
                <li
                    key={String(option.value)}
                    id={`dropdown-option-${index}`}
                    role="option"
                    aria-selected={option.value === value}
                    className={classNames(
                        styles['option'],
                        {
                            [styles['option-selected']]: option.value === value,
                            [styles['option-highlighted']]: index === highlightedIndex,
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
                    <Span>
                        {option.label}
                    </Span>
                </li>
            ))}
        </ul>
    );
}

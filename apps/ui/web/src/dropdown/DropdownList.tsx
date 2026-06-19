import classNames from "classnames";
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
    color = 'neutral',
    iconSize,
    value,
    options,
    onChange,
}: Props & Pick<DropdownProps<T>, 'value' | 'options' | 'color' | 'onChange'>) {
    const handleSelect = (option: DropdownOption<T>) => {
        onChange?.(option.value);
        onClose();
    };

    return (
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
    );
}

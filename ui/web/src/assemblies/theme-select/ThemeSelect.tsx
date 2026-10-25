import { FC } from 'react';
import {
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    getThemeColorPreviewGroups,
    ThemeSelectProps,
    themeSelectColorBoxSizes,
    themeNameOptions,
    themeSpecifications,
    DEFAULT_COLOR,
} from '@ui';
import { Dropdown } from '../../forms/dropdown';
import { ThemeColors } from './ThemeColors';
import styles from './theme-select.module.css';

interface Props extends ThemeSelectProps {
    labelledBy?: string;
    popoverClassName?: string;
}

export const ThemeSelect: FC<Props> = ({
    mode,
    value,
    onChange,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
    labelledBy,
    popoverClassName,
}) => {
    const options = themeNameOptions.map((option) => {
        const groups = getThemeColorPreviewGroups(
            themeSpecifications[option.value][mode],
        );
        return {
            ...option,
            prepend: (
                <ThemeColors groups={groups} className={styles['color-row']} />
            ),
            selectedPrepend: (
                <ThemeColors
                    groups={groups}
                    size={themeSelectColorBoxSizes[size]}
                    className={styles['selected-color-row']}
                />
            ),
        };
    });

    return (
        <Dropdown
            ariaLabel="Theme"
            labelledBy={labelledBy}
            popoverClassName={popoverClassName}
            color={color}
            size={size}
            variant={variant}
            value={value}
            options={options}
            onChange={onChange}
        />
    );
};

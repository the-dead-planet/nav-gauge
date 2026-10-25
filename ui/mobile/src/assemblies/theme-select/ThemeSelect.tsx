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

export const ThemeSelect: FC<ThemeSelectProps> = ({
    mode,
    value,
    onChange,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    variant = DEFAULT_FILL_VARIANT,
}) => {
    const options = themeNameOptions.map((option) => {
        const groups = getThemeColorPreviewGroups(
            themeSpecifications[option.value][mode],
        );
        return {
            ...option,
            label: String(option.label),
            prepend: <ThemeColors groups={groups} />,
            selectedPrepend: (
                <ThemeColors
                    groups={groups}
                    size={themeSelectColorBoxSizes[size]}
                    selected
                />
            ),
        };
    });

    return (
        <Dropdown
            color={color}
            size={size}
            variant={variant}
            value={value}
            options={options}
            onChange={onChange}
        />
    );
};

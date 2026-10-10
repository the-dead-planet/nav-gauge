import { FC } from 'react';
import {
    DesignSystemColor,
    Theme,
    ThemeColor,
    ThemeSelectProps,
    themeNameOptions,
    themeSpecifications,
} from '@ui';
import { ColorBox } from '../colors';
import { Dropdown } from '../dropdown';
import styles from './theme-select.module.css';

interface Props extends ThemeSelectProps {
    labelledBy?: string;
    popoverClassName?: string;
}

const colorBoxSizes = { xs: 12, sm: 16, md: 20, lg: 24 } as const;

const previewColors: DesignSystemColor[] = [
    'neutral',
    'primary',
    'secondary',
    'tertiary',
];

const getPaletteColorName = (color: ThemeColor) => {
    const name =
        Object.entries(Theme.palette).find(
            ([, paletteColor]) => paletteColor === color,
        )?.[0] ?? 'custom';
    return name.replaceAll('-', ' ');
};

export const ThemeSelect: FC<Props> = ({
    mode,
    value,
    onChange,
    color = 'neutral',
    size = 'md',
    variant = 'fill-inverse',
    labelledBy,
    popoverClassName,
}) => {
    const options = themeNameOptions.map((option) => ({
        ...option,
        prepend: (
            <span className={styles['color-row']} aria-hidden="true">
                {previewColors.map((color) => (
                    <ColorBox
                        key={color}
                        name={`${color} - ${getPaletteColorName(themeSpecifications[option.value][mode].colors[color])}`}
                        color={
                            themeSpecifications[option.value][mode].colors[
                                color
                            ]
                        }
                        showPaletteOnHover
                    />
                ))}
            </span>
        ),
        selectedPrepend: (
            <span className={styles['selected-color-row']} aria-hidden="true">
                {previewColors.map((color) => (
                    <ColorBox
                        key={color}
                        name={`${color} - ${getPaletteColorName(themeSpecifications[option.value][mode].colors[color])}`}
                        color={
                            themeSpecifications[option.value][mode].colors[
                                color
                            ]
                        }
                        size={colorBoxSizes[size]}
                        showPaletteOnHover
                    />
                ))}
            </span>
        ),
    }));

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

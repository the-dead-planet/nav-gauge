import { FC, ReactNode } from 'react';
import { DesignSystemColor, ThemeName, ThemeSelectProps, themeNameOptions, themeSpecifications } from '@ui';
import { Dropdown } from '../dropdown';
import styles from './theme-select.module.css';

const previewColors: DesignSystemColor[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const ThemeSelect: FC<ThemeSelectProps> = ({ mode, value, onChange }) => {
    const renderOption = (themeName: ThemeName, label: ReactNode) => (
        <span className={styles['option-content']}>
            <span className={styles['color-row']} aria-hidden="true">
                {previewColors.map((color) => {
                    const { r, g, b } = themeSpecifications[themeName][mode].colors[color][500];
                    return (
                        <span
                            key={color}
                            className={styles['color-box']}
                            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                        />
                    );
                })}
            </span>
            <span>{label}</span>
        </span>
    );

    return (
        <Dropdown
            ariaLabel="Theme"
            size="md"
            value={value}
            options={themeNameOptions}
            onChange={onChange}
            renderOption={renderOption}
        />
    );
};

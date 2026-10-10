import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    DesignSystemColor,
    ThemeSelectProps,
    themeNameOptions,
    themeSpecifications,
} from '@ui';
import { ColorBox } from '../colors';
import { Dropdown } from '../dropdown';

const styles = StyleSheet.create({
    colorRow: {
        flexDirection: 'row',
        gap: 2,
    },
    selectedColorRow: {
        flexDirection: 'row',
        gap: 4,
    },
});

const previewColors: DesignSystemColor[] = [
    'neutral',
    'primary',
    'secondary',
    'tertiary',
];

const colorBoxSizes = { xs: 12, sm: 16, md: 20, lg: 24 } as const;

export const ThemeSelect: FC<ThemeSelectProps> = ({
    mode,
    value,
    onChange,
    color = 'neutral',
    size = 'md',
    variant = 'fill-inverse',
}) => {
    const options = themeNameOptions.map((option) => ({
        ...option,
        label: String(option.label),
        prepend: (
            <View style={styles.colorRow} accessibilityElementsHidden>
                {previewColors.map((color) => (
                    <ColorBox
                        key={color}
                        color={
                            themeSpecifications[option.value][mode].colors[
                                color
                            ]
                        }
                    />
                ))}
            </View>
        ),
        selectedPrepend: (
            <View style={styles.selectedColorRow} accessibilityElementsHidden>
                {previewColors.map((color) => (
                    <ColorBox
                        key={color}
                        color={
                            themeSpecifications[option.value][mode].colors[
                                color
                            ]
                        }
                        size={colorBoxSizes[size]}
                    />
                ))}
            </View>
        ),
    }));

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

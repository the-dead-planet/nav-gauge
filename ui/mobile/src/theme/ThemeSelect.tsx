import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { DesignSystemColor, ThemeName, ThemeSelectProps, themeNameOptions, themeSpecifications, useTheme } from '@ui';
import { Dropdown } from '../dropdown';
import { Text } from '../typography';

const styles = StyleSheet.create({
    optionContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 2,
    },
    colorBox: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});

const previewColors: DesignSystemColor[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const ThemeSelect: FC<ThemeSelectProps> = ({ mode, value, onChange }) => {
    const theme = useTheme();
    const renderOption = (themeName: ThemeName, label: ReactNode) => (
        <View style={styles.optionContent}>
            <View style={styles.colorRow} accessibilityElementsHidden>
                {previewColors.map((color) => {
                    const { r, g, b } = themeSpecifications[themeName][mode].colors[color][500];
                    return (
                        <View
                            key={color}
                            style={[styles.colorBox, { backgroundColor: `rgb(${r}, ${g}, ${b})` }]}
                        />
                    );
                })}
            </View>
            <Text style={{ color: theme.componentColor('text'), flex: 1 }}>{label}</Text>
        </View>
    );

    return (
        <Dropdown
            size="md"
            value={value}
            options={themeNameOptions}
            onChange={onChange}
            renderOption={renderOption}
        />
    );
};

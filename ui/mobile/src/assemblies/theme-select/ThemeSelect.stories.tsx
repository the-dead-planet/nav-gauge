import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    appearanceColorOptions,
    fillVariantOptions,
    sizeOptions,
    themeModeOptions,
    themeSelectStoryArgs,
    themeSelectStoryControls,
    ThemeSelectStoryProps,
} from '@ui';
import { ThemeSelect } from './ThemeSelect';
import { Text } from '../../design-system/typography';
import { MobileStoryDefinition } from '../../storybook/model';

const styles = StyleSheet.create({
    gallery: {
        gap: 16,
        padding: 16,
    },
    section: {
        gap: 8,
    },
});

const Playground = (args: ThemeSelectStoryProps) => {
    const [value, setValue] = useState(args.value);
    return <ThemeSelect {...args} value={value} onChange={setValue} />;
};

const story: MobileStoryDefinition<ThemeSelectStoryProps> = {
    args: themeSelectStoryArgs,
    controls: themeSelectStoryControls,
    galleryEditableControls: ['value'],
    renderPlayground: (args) => <Playground {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {themeModeOptions.map(({ value: mode, label }) => (
                <View key={mode} style={styles.section}>
                    <Text usage="header">{label}</Text>
                    {sizeOptions.map((size) =>
                        appearanceColorOptions.map((color) =>
                            fillVariantOptions.map((variant) => (
                                <View
                                    key={`${size}-${color}-${variant}`}
                                    style={styles.section}
                                >
                                    <Text>
                                        {size} / {color} / {variant}
                                    </Text>
                                    <ThemeSelect
                                        {...args}
                                        mode={mode}
                                        size={size}
                                        color={color}
                                        variant={variant}
                                        onChange={() => undefined}
                                    />
                                </View>
                            )),
                        ),
                    )}
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;

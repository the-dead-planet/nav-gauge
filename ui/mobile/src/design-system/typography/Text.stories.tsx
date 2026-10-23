import { ScrollView, StyleSheet, View } from 'react-native';
import { appearanceColorOptions, FontType, TypographyStoryProps, typographyStoryArgs, typographyStoryControls, typographyUsages } from '@ui';
import { Text } from './Text';
import { MobileStoryDefinition } from '../../storybook/model';

const styles = StyleSheet.create({
    section: {
        gap: 12,
        paddingVertical: 12,
    },
});

const story: MobileStoryDefinition<TypographyStoryProps> = {
    args: typographyStoryArgs,
    controls: typographyStoryControls,
    galleryEditableControls: ['children', 'fontWeight', 'shade', 'highlightColor', 'highlightShade', 'align', 'active', 'disabled', 'bold', 'uppercase', 'tabular', 'nowrap', 'shadow'],
    renderPlayground: (args) => <Text {...args} />,
    renderGallery: ({ children, ...args }) => (
        <ScrollView contentContainerStyle={styles.section}>
            {Object.values(FontType).map((fontType) => (
                <View key={fontType} style={styles.section}>
                    <Text usage="header">{fontType}</Text>
                    {typographyUsages.map((usage) => appearanceColorOptions.map((color) => (
                        <Text
                            {...args}
                            key={`${usage}-${color}`}
                            usage={usage}
                            color={color}
                            fontType={fontType}
                        >
                            {color}: {children}
                        </Text>
                    )))}
                </View>
            ))}
        </ScrollView>
    ),
};

export default story;

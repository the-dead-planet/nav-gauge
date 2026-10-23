import { ScrollView, StyleSheet, View } from 'react-native';
import { appearanceColorOptions, FontType, TypographyStoryProps, typographyStoryArgs, typographyStoryControls, typographyVariants } from '@ui';
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
    galleryEditableControls: ['children', 'shade', 'highlightColor', 'highlightShade', 'align', 'active', 'disabled', 'bold', 'uppercase', 'tabular', 'nowrap', 'shadow'],
    renderPlayground: (args) => <Text {...args} />,
    renderGallery: ({ children, ...args }) => (
        <ScrollView contentContainerStyle={styles.section}>
            {Object.values(FontType).map((fontType) => (
                <View key={fontType} style={styles.section}>
                    <Text variant="header">{fontType}</Text>
                    {typographyVariants.map((variant) => appearanceColorOptions.map((color) => (
                        <Text
                            {...args}
                            key={`${variant}-${color}`}
                            variant={variant}
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

import { ScrollView, StyleSheet } from 'react-native';
import { appearanceColorOptions, TypographyStoryProps, typographyStoryArgs, typographyStoryControls, typographyUsages } from '@ui';
import { Label } from './Label';
import { MobileStoryDefinition } from '../../storybook/model';

const styles = StyleSheet.create({
    gallery: {
        gap: 12,
    },
});

const story: MobileStoryDefinition<TypographyStoryProps> = {
    args: {
        ...typographyStoryArgs,
        usage: 'caption',
        children: 'Label',
    },
    controls: typographyStoryControls,
    galleryEditableControls: ['children', 'fontType', 'fontWeight', 'shade', 'highlightColor', 'highlightShade', 'align', 'highlighted', 'disabled', 'bold', 'uppercase', 'tabular', 'nowrap', 'shadow'],
    renderPlayground: (args) => <Label {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {typographyUsages.map((usage) => appearanceColorOptions.map((color) => (
                <Label {...args} key={`${usage}-${color}`} usage={usage} color={color} />
            )))}
        </ScrollView>
    ),
};

export default story;

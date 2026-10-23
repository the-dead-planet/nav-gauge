import { ScrollView, StyleSheet } from 'react-native';
import { appearanceColorOptions, TypographyStoryProps, typographyStoryArgs, typographyStoryControls, typographyVariants } from '@ui';
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
        variant: 'caption',
        children: 'Label',
    },
    controls: typographyStoryControls,
    galleryEditableControls: ['children', 'fontType', 'fontWeight', 'shade', 'highlightColor', 'highlightShade', 'align', 'active', 'disabled', 'bold', 'uppercase', 'tabular', 'nowrap', 'shadow'],
    renderPlayground: (args) => <Label {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {typographyVariants.map((variant) => appearanceColorOptions.map((color) => (
                <Label {...args} key={`${variant}-${color}`} variant={variant} color={color} />
            )))}
        </ScrollView>
    ),
};

export default story;

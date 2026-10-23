import { ScrollView, StyleSheet } from 'react-native';
import { appearanceColorOptions, typographyStoryArgs, typographyStoryControls, typographyVariants } from '@ui';
import { LinkText, LinkTextProps } from './LinkText';
import { MobileStoryDefinition } from '../../storybook/model';

const styles = StyleSheet.create({
    gallery: {
        gap: 12,
    },
});

const story: MobileStoryDefinition<LinkTextProps> = {
    args: {
        ...typographyStoryArgs,
        href: 'https://openstreetmap.org/copyright',
        children: 'OpenStreetMap copyright',
    },
    controls: {
        ...typographyStoryControls,
        href: {
            control: 'text',
        },
    },
    galleryEditableControls: ['children', 'href', 'fontType', 'fontWeight', 'shade', 'highlightColor', 'highlightShade', 'align', 'active', 'disabled', 'bold', 'uppercase', 'tabular', 'nowrap', 'shadow'],
    renderPlayground: (args) => <LinkText {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            {typographyVariants.map((variant) => appearanceColorOptions.map((color) => (
                <LinkText {...args} key={`${variant}-${color}`} variant={variant} color={color} />
            )))}
        </ScrollView>
    ),
};

export default story;

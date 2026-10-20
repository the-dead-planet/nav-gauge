import { ComponentProps } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    fillVariantOptions,
    toggleSwitchOrientations,
    toggleSwitchStoryArgs,
    toggleSwitchStoryControls,
} from '@ui';
import { Text } from '../../design-system/typography';
import { MobileStoryDefinition } from '../../storybook/model';
import { VariantGallery } from '../../storybook/VariantGallery';
import { ToggleSwitch } from './ToggleSwitch';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    section: {
        gap: 8,
    },
});

const story = {
    args: {
        ...toggleSwitchStoryArgs,
        contentShade: undefined,
        highlightColor: undefined,
        highlightContentShade: undefined,
        onChange: () => {},
    },
    controls: toggleSwitchStoryControls,
    galleryEditableControls: [
        'children',
        'checked',
        'contentShade',
        'highlightColor',
        'highlightContentShade',
        'active',
        'disabled',
    ],
    renderPlayground: (args) => <ToggleSwitch {...args} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.container}>
            {toggleSwitchOrientations.map((orientation) => (
                <View key={orientation} style={styles.section}>
                    <Text>{orientation}</Text>
                    <VariantGallery
                        variants={fillVariantOptions}
                        scrollEnabled={false}
                        render={({ color, size, variant }) => (
                            <ToggleSwitch
                                {...args}
                                color={color}
                                orientation={orientation}
                                size={size}
                                variant={variant}
                            />
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    ),
} satisfies MobileStoryDefinition<ComponentProps<typeof ToggleSwitch>>;

export default story;

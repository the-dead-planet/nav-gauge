import { ComponentProps } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { hexagonShapes, hexagonStoryArgs, hexagonStoryControls, surfaceVariantOptions } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { MobileStoryDefinition } from '../../storybook/model';
import { Text } from '../../design-system/typography';
import { Hexagon } from './Hexagon';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 32,
    },
    section: {
        gap: 12,
    },
    states: {
        gap: 8,
        alignItems: 'center',
    },
    heading: {
        fontWeight: '700',
    },
});

const story = {
    args: {
        ...hexagonStoryArgs,
        highlightColor: undefined,
    },
    controls: hexagonStoryControls,
    galleryEditableControls: ['highlightColor', 'strokeWidth', 'interactive', 'active', 'disabled', 'activeGlow'],
    renderPlayground: (args) => <Hexagon {...args} />,
    renderGallery: (args) => {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {hexagonShapes.map((shape) => (
                    <View key={shape} style={styles.section}>
                        <Text style={styles.heading}>{shape}</Text>
                        <VariantGallery
                            variants={surfaceVariantOptions}
                            scrollEnabled={false}
                            render={({ color, size, variant }) => (
                                <View style={styles.states}>
                                    <Hexagon
                                        {...args}
                                        color={color}
                                        size={size}
                                        variant={variant}
                                        shape={shape}
                                    />
                                </View>
                            )}
                        />
                    </View>
                ))}
            </ScrollView>
        );
    },
} satisfies MobileStoryDefinition<ComponentProps<typeof Hexagon>>;

export default story;

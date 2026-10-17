import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { surfaceVariantOptions } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
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

const shapes = ['pointy-top', 'flat-top'] as const;

export const Playground: FC = () => {
    const [active, setActive] = useState(false);

    return (
        <Hexagon
            color="primary"
            variant="fill-translucent"
            size="md"
            interactive
            active={active}
            onPress={() => setActive((current) => !current)}
        >
            <Text>Hexagon</Text>
        </Hexagon>
    );
};

export const Gallery: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        {shapes.map((shape) => (
            <View key={shape} style={styles.section}>
                <Text style={styles.heading}>{shape}</Text>
                <VariantGallery
                    variants={surfaceVariantOptions}
                    scrollEnabled={false}
                    render={({ color, size, variant }) => (
                        <View style={styles.states}>
                            <Hexagon color={color} size={size} variant={variant} shape={shape}>
                                <Text>D</Text>
                            </Hexagon>
                            <Hexagon color={color} size={size} variant={variant} shape={shape} active>
                                <Text>A</Text>
                            </Hexagon>
                            <Hexagon color={color} size={size} variant={variant} shape={shape} disabled>
                                <Text>X</Text>
                            </Hexagon>
                        </View>
                    )}
                />
            </View>
        ))}
    </ScrollView>
);

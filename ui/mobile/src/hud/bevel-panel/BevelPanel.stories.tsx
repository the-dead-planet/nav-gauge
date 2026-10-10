import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../typography';
import { VariantGallery } from '../../storybook/VariantGallery';
import { BevelPanel } from './BevelPanel';

const styles = StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
});

export const Playground: FC = () => <BevelPanel color="primary" variant="fill-translucent" size="md"><Text>Preview</Text></BevelPanel>;
export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <BevelPanel color={color} variant={variant} size={size}>
                <Text>Preview</Text>
            </BevelPanel>
        )}
    />
);
export const InteractiveGlow: FC = () => <View style={styles.grid}><BevelPanel interactive color="primary" size="md"><Text>Default glow</Text></BevelPanel><BevelPanel interactive glowStyle="glow" color="secondary" size="md"><Text>Glow</Text></BevelPanel><BevelPanel interactive glowStyle="animate-borders-glow" color="tertiary" size="md"><Text>Borders</Text></BevelPanel></View>;
export const States: FC = () => <View style={styles.grid}><BevelPanel active color="primary" variant="fill-inverse" size="md"><Text>Active</Text></BevelPanel><BevelPanel disabled color="primary" variant="fill-inverse" size="md"><Text>Disabled</Text></BevelPanel></View>;

import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '@ui';
import { ColorBox } from './ColorBox';

const styles = StyleSheet.create({
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
});

export const Playground: FC = () => (
    <ColorBox color={Theme.palette.copper} size={24} />
);

export const Gallery: FC = () => (
    <View style={styles.gallery}>
        {Object.entries(Theme.palette).map(([name, color]) => (
            <ColorBox key={name} color={color} size={24} />
        ))}
    </View>
);

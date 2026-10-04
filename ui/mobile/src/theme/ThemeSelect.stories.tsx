import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeName } from '@ui';
import { ThemeSelect } from './ThemeSelect';

const styles = StyleSheet.create({
    gallery: {
        gap: 16,
    },
});

export const Playground: FC = () => {
    const [value, setValue] = useState(ThemeName.Default);
    return <ThemeSelect mode="dark" value={value} onChange={setValue} />;
};

export const Gallery: FC = () => (
    <View style={styles.gallery}>
        <ThemeSelect
            mode="light"
            value={ThemeName.Default}
            onChange={() => undefined}
        />
        <ThemeSelect
            mode="dark"
            value={ThemeName.Default}
            onChange={() => undefined}
        />
    </View>
);

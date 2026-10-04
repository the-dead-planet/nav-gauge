import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeMode } from '@ui';
import { ThemeModeToggle } from './ThemeModeToggle';

const styles = StyleSheet.create({
    gallery: {
        flexDirection: 'row',
        gap: 16,
    },
});

export const Playground: FC = () => {
    const [mode, setMode] = useState<ThemeMode>('dark');

    return (
        <ThemeModeToggle
            mode={mode}
            lightModeTooltip="Switch to light mode"
            darkModeTooltip="Switch to dark mode"
            onToggle={() => setMode((currentMode) => currentMode === 'dark' ? 'light' : 'dark')}
        />
    );
};

export const Gallery: FC = () => (
    <View style={styles.gallery}>
        <ThemeModeToggle
            mode="light"
            lightModeTooltip="Switch to light mode"
            darkModeTooltip="Switch to dark mode"
            onToggle={() => undefined}
        />
        <ThemeModeToggle
            mode="dark"
            lightModeTooltip="Switch to light mode"
            darkModeTooltip="Switch to dark mode"
            onToggle={() => undefined}
        />
    </View>
);

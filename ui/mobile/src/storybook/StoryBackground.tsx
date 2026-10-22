import { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { useTheme } from '@ui';

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    pattern: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});

export const StoryBackground: FC<{ children: ReactNode }> = ({ children }) => {
    const theme = useTheme();

    return (
        <View style={[styles.background, { backgroundColor: theme.surfaceColor('background') }]}>
            <Svg style={styles.pattern} width="100%" height="100%" pointerEvents="none" accessibilityElementsHidden>
                <Defs>
                    <Pattern id="story-stripes" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <Rect x="8" width="20" height="64" fill={theme.surfaceColor('content', 0.09)} />
                    </Pattern>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#story-stripes)" />
            </Svg>
            {children}
        </View>
    );
};

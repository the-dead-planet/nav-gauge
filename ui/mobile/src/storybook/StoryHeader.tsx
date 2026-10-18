import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icons } from '@ui';
import { Text } from '../design-system/typography';
import { Button } from '../gizmos/button';

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    heading: {
        fontSize: 22,
        fontWeight: '700',
    },
});

export const StoryHeader: FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <View style={styles.header}>
        <Button
            icon={Icons.NounProject.ChevronDownDouble}
            iconRotateZ={90}
            onPress={onBack}
            accessibilityLabel="Back"
        />
        <Text style={styles.heading}>{title}</Text>
    </View>
);

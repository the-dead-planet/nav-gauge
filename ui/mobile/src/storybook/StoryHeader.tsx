import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../design-system/typography';

const styles = StyleSheet.create({
    heading: {
        fontSize: 22,
        fontWeight: '700',
    },
});

export const StoryHeader: FC<{ title: string }> = ({ title }) => (
    <Text style={styles.heading}>{title}</Text>
);

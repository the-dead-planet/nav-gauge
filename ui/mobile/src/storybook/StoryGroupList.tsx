import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Icons } from '@ui';
import { Text } from '../design-system/typography';
import { Button } from '../gizmos/button';
import { StoryEntry, StoryGroup } from './model';
import { StoryHeader } from './StoryHeader';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 16,
        gap: 16,
    },
    list: {
        gap: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    arrow: {
        width: 32,
    },
});

interface Props {
    group: StoryGroup;
    onBack: () => void;
    onSelect: (entry: StoryEntry) => void;
}

export const StoryGroupList: FC<Props> = ({ group, onBack, onSelect }) => (
    <View style={styles.page}>
        <StoryHeader title={group.name} onBack={onBack} />
        <ScrollView contentContainerStyle={styles.list}>
            {group.entries.map((entry) => (
                <View key={entry.id} style={styles.item}>
                    <View style={styles.arrow}>
                        <Button
                            icon={Icons.NounProject.ChevronDownDoubleTriangle}
                            iconRotateZ={-90}
                            size="xs"
                            onPress={() => onSelect(entry)}
                            accessibilityLabel={`Open ${entry.name}`}
                        />
                    </View>
                    <Text>{entry.name}</Text>
                </View>
            ))}
        </ScrollView>
    </View>
);

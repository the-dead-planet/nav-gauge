import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Icons, useTheme } from '@ui';
import { Button } from '../gizmos/button';
import { TextInput } from '../forms/text-input';
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
        alignSelf: 'flex-start',
    },
});

interface Props {
    group: StoryGroup;
    onSelect: (entry: StoryEntry) => void;
}

export const StoryGroupList: FC<Props> = ({ group, onSelect }) => {
    const theme = useTheme();
    const [query, setQuery] = useState('');
    const normalizedQuery = query.trim().toLowerCase();
    const entries = group.entries.filter((entry) => !normalizedQuery
        || entry.name.toLowerCase().includes(normalizedQuery));

    return (
        <View style={styles.page}>
            <StoryHeader title={group.name} />
            <TextInput
                label="Search components"
                placeholder="Popup"
                value={query}
                onChange={setQuery}
            />
            <ScrollView contentContainerStyle={styles.list}>
                {entries.map((entry) => (
                    <Button
                        key={entry.id}
                        icon={Icons.NounProject.ChevronDownDoubleTriangle}
                        iconRotateZ={-90}
                        size="md"
                        contentShade={theme.isLight ? 900 : 100}
                        onPress={() => onSelect(entry)}
                        accessibilityLabel={`Open ${entry.name}`}
                        style={styles.item}
                    >
                        {entry.name}
                    </Button>
                ))}
            </ScrollView>
        </View>
    );
};

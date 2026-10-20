import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput } from '../forms/text-input';
import { StoryEntry, StoryGroup } from './model';
import { StoryEntryButtons } from './StoryEntryButtons';
import { StoryHeader } from './StoryHeader';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 16,
        gap: 16,
    },
});

interface Props {
    group: StoryGroup;
    query: string;
    onQueryChange: (query: string) => void;
    onSelect: (entry: StoryEntry) => void;
}

export const StoryGroupList: FC<Props> = ({ group, query, onQueryChange, onSelect }) => {
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
                onChange={onQueryChange}
            />
            <ScrollView>
                <StoryEntryButtons entries={entries} onSelect={onSelect} />
            </ScrollView>
        </View>
    );
};

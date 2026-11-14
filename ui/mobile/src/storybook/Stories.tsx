import { FC, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { TextInput } from '../forms/text-input';
import { ComponentStory } from './ComponentStory';
import { discoverStoryGroups } from './discoverStories';
import { GroupTile } from './GroupTile';
import { StoryBackground } from './StoryBackground';
import { StoryGroupList } from './StoryGroupList';
import { StoryHeader } from './StoryHeader';
import { useStoryNavigation } from './useStoryNavigation';

const styles = StyleSheet.create({
    page: {
        flexGrow: 1,
        padding: 16,
        gap: 16,
    },
    scroll: {
        flex: 1,
    },
    search: {
        width: '100%',
    },
    tiles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
});

const storyGroups = discoverStoryGroups();

export const Stories: FC<{ isFocused: boolean }> = ({ isFocused }) => {
    const { width, height } = useWindowDimensions();
    const [query, setQuery] = useState('');
    const { selectedEntry, setSelectedEntry, selectedGroup, setSelectedGroup } = useStoryNavigation(isFocused);
    const normalizedQuery = query.trim().toLowerCase();
    const groups = storyGroups.filter((group) => !normalizedQuery
        || group.name.toLowerCase().includes(normalizedQuery)
        || group.entries.some((entry) => entry.name.toLowerCase().includes(normalizedQuery)));

    if (selectedEntry) {
        return (
            <StoryBackground>
                <ComponentStory entry={selectedEntry} />
            </StoryBackground>
        );
    }

    if (selectedGroup) {
        return (
            <StoryBackground>
                <StoryGroupList
                    group={selectedGroup}
                    query={query}
                    onQueryChange={setQuery}
                    onSelect={setSelectedEntry}
                />
            </StoryBackground>
        );
    }

    const tileWidth = width > height ? '23%' : '48%';

    return (
        <StoryBackground>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
                <StoryHeader title="UI Components" />
                <View style={styles.search}>
                    <TextInput
                        label="Search groups or components"
                        placeholder="Popup"
                        value={query}
                        onChange={setQuery}
                    />
                </View>
                <View style={styles.tiles}>
                    {groups.map((group) => (
                        <GroupTile
                            key={group.name}
                            group={group}
                            width={tileWidth}
                            onEnter={() => setSelectedGroup(group)}
                            onSelect={setSelectedEntry}
                        />
                    ))}
                </View>
            </ScrollView>
        </StoryBackground>
    );
};

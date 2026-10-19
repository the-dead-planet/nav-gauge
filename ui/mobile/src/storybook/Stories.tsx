import { FC, useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '../design-system/typography';
import { TextInput } from '../forms/text-input';
import { ComponentStory } from './ComponentStory';
import { discoverStoryGroups } from './discoverStories';
import { GroupTile } from './GroupTile';
import { StoryEntry, StoryGroup } from './model';
import { StoryBackground } from './StoryBackground';
import { StoryGroupList } from './StoryGroupList';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 16,
        gap: 16,
    },
    heading: {
        fontSize: 22,
        fontWeight: '700',
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

export const Stories: FC = () => {
    const { width, height } = useWindowDimensions();
    const [query, setQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<StoryGroup | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<StoryEntry | null>(null);
    const normalizedQuery = query.trim().toLowerCase();
    const groups = storyGroups.filter((group) => !normalizedQuery
        || group.name.includes(normalizedQuery)
        || group.entries.some((entry) => entry.name.toLowerCase().includes(normalizedQuery)));

    useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
            if (selectedEntry) {
                setSelectedEntry(null);
                return true;
            }
            if (selectedGroup) {
                setSelectedGroup(null);
                return true;
            }
            return false;
        });

        return () => subscription.remove();
    }, [selectedEntry, selectedGroup]);

    if (selectedEntry) {
        return <StoryBackground><ComponentStory entry={selectedEntry} onBack={() => setSelectedEntry(null)} /></StoryBackground>;
    }

    if (selectedGroup) {
        return (
            <StoryBackground>
                <StoryGroupList
                    group={selectedGroup}
                    onBack={() => setSelectedGroup(null)}
                    onSelect={setSelectedEntry}
                />
            </StoryBackground>
        );
    }

    const tileWidth = width > height ? '23%' : '48%';

    return (
        <StoryBackground>
            <ScrollView contentContainerStyle={styles.page}>
                <Text style={styles.heading}>UI Components</Text>
                <View style={styles.search}>
                    <TextInput label="Search groups or components" placeholder="Popup" value={query} onChange={setQuery} />
                </View>
                <View style={styles.tiles}>
                    {groups.map((group) => (
                        <GroupTile key={group.name} group={group} width={tileWidth} onEnter={() => setSelectedGroup(group)} />
                    ))}
                </View>
            </ScrollView>
        </StoryBackground>
    );
};

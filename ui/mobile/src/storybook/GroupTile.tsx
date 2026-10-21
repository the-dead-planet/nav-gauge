import { FC, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icons, useTheme } from '@ui';
import { Text } from '../design-system/typography';
import { Button } from '../gizmos/button';
import { Popup } from '../rigs/popup';
import { Tile } from '../assemblies/tile';
import { StoryEntry, StoryGroup } from './model';
import { StoryEntryButtons } from './StoryEntryButtons';

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 16,
    },
    components: {
        gap: 4,
        flexGrow: 1,
        minWidth: 0,
    },
    component: {
        fontSize: 14,
        lineHeight: 18,
    },
    more: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    popup: {
        borderWidth: 1,
        gap: 16,
    },
    popupList: {
        flexShrink: 1,
    },
    popupListContent: {
        paddingHorizontal: 16,
    },
    footer: {
        alignItems: 'flex-end',
    },
});

interface Props {
    group: StoryGroup;
    width: string;
    onEnter: () => void;
    onSelect: (entry: StoryEntry) => void;
}

export const GroupTile: FC<Props> = ({ group, width, onEnter, onSelect }) => {
    const theme = useTheme();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();
    const [showComponents, setShowComponents] = useState(false);
    const hiddenCount = Math.max(0, group.entries.length - 3);

    return (
        <>
            <Tile
                name={group.name}
                description={group.description}
                actions={(size) => (
                    <Button size={size} variant="fill" onPress={onEnter}>
                        Enter
                    </Button>
                )}
                panelProps={{
                    variant: 'fill-inverse',
                    style: { width },
                }}
            >
                <View style={styles.components}>
                    {group.entries.slice(0, 3).map((entry) => (
                        <Text key={entry.id} style={styles.component}>
                            • {entry.name}
                        </Text>
                    ))}
                    {hiddenCount > 0 ? (
                        <View style={styles.more}>
                            <Text style={styles.component}>
                                and {hiddenCount} more
                            </Text>
                            <Button
                                icon={Icons.NounProject.Components}
                                size="xs"
                                onPress={() => setShowComponents(true)}
                                accessibilityLabel={`Show all ${group.name} components`}
                            />
                        </View>
                    ) : null}
                </View>
            </Tile>
            <Popup
                visible={showComponents}
                position={{ x: 16, y: safeAreaInsets.top + 16 }}
                popupAnchor="top-left"
                onClose={() => setShowComponents(false)}
                popupStyle={[
                    styles.popup,
                    {
                        width: Math.min(420, windowWidth - 32),
                        maxHeight: windowHeight - safeAreaInsets.top - safeAreaInsets.bottom - 32,
                        backgroundColor: theme.structuralColor('background'),
                        borderColor: theme.structuralColor('border'),
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{group.name}</Text>
                </View>
                <ScrollView
                    style={styles.popupList}
                    contentContainerStyle={styles.popupListContent}
                >
                    <StoryEntryButtons entries={group.entries} onSelect={onSelect} />
                </ScrollView>
                <View style={styles.footer}>
                    <Button variant="fill" onPress={() => setShowComponents(false)}>
                        Close
                    </Button>
                </View>
            </Popup>
        </>
    );
};

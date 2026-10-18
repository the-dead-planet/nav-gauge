import { FC, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Icons, useTheme } from '@ui';
import { Text } from '../design-system/typography';
import { Button } from '../gizmos/button';
import { Popup } from '../rigs/popup';
import { StoryGroup } from './model';

const styles = StyleSheet.create({
    tile: {
        borderWidth: 1,
        padding: 12,
        gap: 10,
        minHeight: 190,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    components: {
        gap: 4,
        flex: 1,
    },
    footer: {
        alignItems: 'flex-end',
    },
    popup: {
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    popupList: {
        maxHeight: 320,
    },
});

interface Props {
    group: StoryGroup;
    width: string;
    onEnter: () => void;
}

export const GroupTile: FC<Props> = ({ group, width, onEnter }) => {
    const theme = useTheme();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [showComponents, setShowComponents] = useState(false);
    const hiddenCount = Math.max(0, group.entries.length - 3);

    return (
        <View style={[styles.tile, { width, borderColor: theme.componentColor('border') }]}>
            <View style={styles.header}>
                <Text style={styles.title}>{group.name}</Text>
                <Button
                    icon={Icons.NounProject.Components}
                    size="xs"
                    onPress={() => setShowComponents(true)}
                    accessibilityLabel={`Show all ${group.name} components`}
                />
            </View>
            <Text>{group.description}</Text>
            <View style={styles.components}>
                {group.entries.slice(0, 3).map((entry) => <Text key={entry.id}>• {entry.name}</Text>)}
                {hiddenCount > 0 ? <Text>and {hiddenCount} more</Text> : null}
            </View>
            <View style={styles.footer}>
                <Button variant="fill" onPress={onEnter}>Enter</Button>
            </View>
            <Popup
                visible={showComponents}
                position={{ x: 16, y: 72 }}
                popupAnchor="top-left"
                onClose={() => setShowComponents(false)}
                popupStyle={[
                    styles.popup,
                    {
                        width: Math.min(420, windowWidth - 32),
                        maxHeight: windowHeight - 96,
                        backgroundColor: theme.componentColor('background'),
                        borderColor: theme.componentColor('border'),
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{group.name}</Text>
                    <Button
                        icon={Icons.NounProject.CloseCrossFill}
                        size="xs"
                        onPress={() => setShowComponents(false)}
                        accessibilityLabel="Close component list"
                    />
                </View>
                <ScrollView style={styles.popupList}>
                    {group.entries.map((entry) => <Text key={entry.id}>• {entry.name}</Text>)}
                </ScrollView>
            </Popup>
        </View>
    );
};

import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icons, useTheme } from '@ui';
import { Button } from '../gizmos/button';
import { StoryEntry } from './model';

const styles = StyleSheet.create({
    list: {
        gap: 8,
    },
    item: {
        alignSelf: 'flex-start',
    },
});

interface Props {
    entries: StoryEntry[];
    onSelect: (entry: StoryEntry) => void;
}

export const StoryEntryButtons: FC<Props> = ({ entries, onSelect }) => {
    const theme = useTheme();

    return (
        <View style={styles.list}>
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
        </View>
    );
};

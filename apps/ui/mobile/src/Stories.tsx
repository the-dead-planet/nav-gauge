import { FC, ComponentType, useState } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "./text";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        rowGap: 40,
    },
    back: {
        paddingVertical: 12,
    },
    componentName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12
    },
    list: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 40
    },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20
    },
    item: {
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 16

    },
});

interface StoryEntry {
    label: string;
    components: {
        label: string;
        Component: ComponentType;
    }[];
}

function discoverStories(): StoryEntry[] {
    const entries: StoryEntry[] = [];
    const context = require.context("./", true, /\.stories\.tsx$/);

    context.keys().forEach((key: string) => {
        const mod = context(key) as Record<string, unknown>;

        entries.push({
            label: key.replace(/^\.\//, "").replace(/\.stories\.tsx$/, ""),
            components: Object.keys(mod).map((exportName) => ({
                label: exportName,
                Component: mod[exportName] as ComponentType,
            })),
        });
        ;
    });

    return entries;
}

const stories = discoverStories();

export const Stories: FC = () => {
    const theme = useTheme();
    const [selected, setSelected] = useState<StoryEntry | null>(null);

    if (selected) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.back}>
                    <Text style={{ color: theme.color('blue', 400), fontWeight: 700, fontSize: 16}}>{"< Back"}</Text>
                </TouchableOpacity>
                {selected.components.map(({ label, Component }) => (
                    <View key={label}>
                        <Text style={styles.componentName}>{label}</Text>
                        <Component />
                    </View>
                ))}
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.list}>
            <Text style={styles.heading}>UI Components</Text>
            {stories.map((entry, i) => (
                <TouchableOpacity
                    key={i}
                    onPress={() => setSelected(entry)}
                    style={[styles.item, {
                        borderBottomColor: theme.componentColor('border'),
                    }]}
                >
                    <Text style={styles.itemText}>{entry.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

import { FC, ComponentType, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";

interface StoryEntry {
    label: string;
    Component: ComponentType;
}

function discoverStories(): StoryEntry[] {
    const entries: StoryEntry[] = [];
    const context = require.context("./", true, /\.stories\.tsx$/);
    context.keys().forEach((key: string) => {
        const mod = context(key) as Record<string, unknown>;
        const prefix = key.replace(/^\.\//, "").replace(/\.stories\.tsx$/, "");
        Object.keys(mod).forEach((exportName) => {
            const Comp = mod[exportName] as ComponentType;
            entries.push({
                label: `${prefix} > ${exportName}`,
                Component: Comp,
            });
        });
    });
    return entries;
}

const stories = discoverStories();

export const Stories: FC = () => {
    const [selected, setSelected] = useState<StoryEntry | null>(null);

    if (selected) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.back}>
                    <Text style={styles.backText}>{"< Back"}</Text>
                </TouchableOpacity>
                <selected.Component />
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
                    style={styles.item}
                >
                    <Text style={styles.itemText}>{entry.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
    back: { paddingVertical: 12, marginBottom: 16 },
    backText: { color: "#00aaff", fontSize: 16 },
    list: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 40 },
    heading: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    item: { paddingVertical: 14, borderBottomWidth: 1, borderColor: "#333" },
    itemText: { fontSize: 16 },
});

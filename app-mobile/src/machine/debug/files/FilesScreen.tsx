import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "@mobile-ui";
import { useTheme } from "@ui";
import { StorageEntry, useStorageBrowser } from "@mobile-apparatus";
import { FileImagePreview } from "./FileImagePreview";

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    section: {
        gap: 8,
    },
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
});

export const FilesScreen = () => {
    const theme = useTheme();
    const browser = useStorageBrowser();
    const [preview, setPreview] = useState<StorageEntry | null>(null);
    const entries = browser.listing?.entries ?? [];
    const files = entries.filter((entry) => !entry.isDirectory);
    const totalBytes = files.reduce((total, entry) => total + entry.size, 0);

    return (
        <View
            style={[
                styles.screen,
                { backgroundColor: theme.resolveAppearance().surface },
            ]}
        >
            <FlatList
                key={browser.location?.path ?? "storage-roots"}
                contentContainerStyle={styles.content}
                data={entries}
                keyExtractor={(entry) => entry.path}
                ListHeaderComponent={
                    <View style={styles.section}>
                        <Text usage="header">Files · debug</Text>
                        <Text>
                            Read-only app storage. Refresh after importing files
                            or clearing the workspace.
                        </Text>
                        <Text>
                            Imported provider URIs and in-memory map images are
                            not files here.
                        </Text>
                        {browser.location ? (
                            <>
                                <Text bold>{browser.location.root.label}</Text>
                                <Text selectable>{browser.location.path}</Text>
                                <View style={styles.actions}>
                                    <Button
                                        size="sm"
                                        onPress={() => {
                                            setPreview(null);
                                            browser.goUp();
                                        }}
                                    >
                                        Up
                                    </Button>
                                    <Button
                                        size="sm"
                                        onPress={() => {
                                            setPreview(null);
                                            browser.refresh();
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                </View>
                                {browser.loading ? (
                                    <Text accessibilityLiveRegion="polite">
                                        Loading…
                                    </Text>
                                ) : null}
                                {browser.error ? (
                                    <Text
                                        color="glitch"
                                        accessibilityRole="alert"
                                    >
                                        {browser.error}
                                    </Text>
                                ) : null}
                                {browser.listing ? (
                                    <Text>
                                        {browser.listing.exists
                                            ? `${entries.length - files.length} folders · ${files.length} files · ${totalBytes.toLocaleString()} bytes (listed files only)`
                                            : "Not created, or removed during cleanup."}
                                    </Text>
                                ) : null}
                                {browser.listing?.exists &&
                                entries.length === 0 ? (
                                    <Text>Empty folder.</Text>
                                ) : null}
                            </>
                        ) : (
                            browser.folders.map((folder) => (
                                <View key={folder.path} style={styles.section}>
                                    <Button
                                        size="sm"
                                        onPress={() =>
                                            browser.openFolder(folder)
                                        }
                                    >
                                        {folder.label}
                                    </Button>
                                    <Text selectable>{folder.path}</Text>
                                </View>
                            ))
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.section}>
                        {item.isDirectory ? (
                            <Button
                                size="sm"
                                onPress={() => {
                                    setPreview(null);
                                    if (browser.location) {
                                        browser.openFolder(
                                            browser.location.root,
                                            item.path,
                                        );
                                    }
                                }}
                            >
                                {item.name}/
                            </Button>
                        ) : (
                            <Text bold selectable>
                                {item.name}
                            </Text>
                        )}
                        <Text selectable>{item.path}</Text>
                        <Text usage="caption">
                            {item.isDirectory
                                ? "Folder"
                                : `${item.size.toLocaleString()} bytes`}
                            {item.modified
                                ? ` · ${item.modified.toLocaleString()}`
                                : ""}
                        </Text>
                        {!item.isDirectory &&
                        /\.(jpe?g|png|webp|gif|bmp)$/i.test(item.name) ? (
                            <Button size="sm" onPress={() => setPreview(item)}>
                                Preview image
                            </Button>
                        ) : null}
                    </View>
                )}
            />
            {preview ? (
                <FileImagePreview
                    key={preview.path}
                    entry={preview}
                    onClose={() => setPreview(null)}
                />
            ) : null}
        </View>
    );
};

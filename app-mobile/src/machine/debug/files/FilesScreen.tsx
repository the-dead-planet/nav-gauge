import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
    Button,
    StoryBackground,
    StoryHeader,
    Text,
    TextInput,
} from "@mobile-ui";
import { useStorageBrowser } from "@mobile-apparatus";
import { StorageLocations } from "./StorageLocations";
import { StorageFileRow } from "./StorageFileRow";
import { formatFileSize } from "./file-presentation";
import { useFilesBackNavigation } from "./useFilesBackNavigation";

const styles = StyleSheet.create({
    page: {
        flex: 1,
        padding: 16,
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    heading: {
        flex: 1,
        gap: 4,
    },
    actions: {
        flexDirection: "row",
        gap: 8,
    },
    content: {
        gap: 8,
        paddingBottom: 16,
    },
    status: {
        minHeight: 20,
    },
});

export const FilesScreen = () => {
    const browser = useStorageBrowser();
    const [query, setQuery] = useState("");
    const [showPath, setShowPath] = useState(false);
    const entries = browser.listing?.entries ?? [];
    const normalizedQuery = query.trim().toLowerCase();
    const visibleEntries = entries.filter((entry) =>
        entry.name.toLowerCase().includes(normalizedQuery),
    );
    const files = entries.filter((entry) => !entry.isDirectory);
    const totalBytes = files.reduce((total, entry) => total + entry.size, 0);
    const location = browser.location;

    const goUp = () => {
        setQuery("");
        setShowPath(false);
        browser.goUp();
    };
    useFilesBackNavigation(location ? goUp : undefined);

    return (
        <StoryBackground>
            {location ? (
                <View style={styles.page}>
                    <View style={styles.header}>
                        <View style={styles.heading}>
                            <StoryHeader
                                title={
                                    location.path === location.root.path
                                        ? location.root.label
                                        : (location.path.split("/").pop() ??
                                          "Files")
                                }
                            />
                            <Text usage="caption" numberOfLines={2}>
                                {location.path === location.root.path
                                    ? "App files"
                                    : location.root.label}
                                {location.path
                                    .slice(location.root.path.length)
                                    .replaceAll("/", " / ")}
                            </Text>
                        </View>
                        <Button size="sm" onPress={browser.refresh}>
                            Refresh
                        </Button>
                    </View>
                    <View style={styles.actions}>
                        <Button size="sm" onPress={goUp}>
                            Back
                        </Button>
                        <Button
                            size="sm"
                            onPress={() => setShowPath(!showPath)}
                        >
                            {showPath ? "Hide path" : "Show path"}
                        </Button>
                    </View>
                    {showPath ? <Text selectable>{location.path}</Text> : null}
                    <TextInput
                        label="Search this folder"
                        placeholder="File or folder name"
                        value={query}
                        onChange={setQuery}
                    />
                    <View style={styles.status}>
                        <Text usage="caption" accessibilityLiveRegion="polite">
                            {browser.loading
                                ? "Refreshing…"
                                : browser.listing?.exists
                                  ? `${entries.length - files.length} folders · ${files.length} files · ${formatFileSize(totalBytes)} in listed files`
                                  : ""}
                        </Text>
                    </View>
                    {browser.error ? (
                        <Text color="glitch" accessibilityRole="alert">
                            Could not read this folder: {browser.error}
                        </Text>
                    ) : null}
                    <FlatList
                        key={location.path}
                        data={visibleEntries}
                        contentContainerStyle={styles.content}
                        keyExtractor={(entry) => entry.path}
                        refreshing={browser.loading}
                        onRefresh={browser.refresh}
                        keyboardShouldPersistTaps="handled"
                        initialNumToRender={6}
                        maxToRenderPerBatch={6}
                        windowSize={5}
                        ListEmptyComponent={
                            browser.listing &&
                            !browser.loading &&
                            !browser.error ? (
                                <Text>
                                    {browser.listing?.exists === false
                                        ? "This folder has not been created yet, or was cleaned up. Go back or refresh after using the workspace."
                                        : normalizedQuery
                                          ? "No matching files or folders. Try another name."
                                          : "This folder is empty."}
                                </Text>
                            ) : undefined
                        }
                        renderItem={({ item }) => (
                            <StorageFileRow
                                entry={item}
                                refreshVersion={browser.refreshVersion}
                                onOpen={() => {
                                    if (item.isDirectory) {
                                        setQuery("");
                                        setShowPath(false);
                                        browser.openFolder(
                                            location.root,
                                            item.path,
                                        );
                                    }
                                }}
                            />
                        )}
                    />
                </View>
            ) : (
                <StorageLocations
                    folders={browser.folders}
                    onOpen={(folder) => browser.openFolder(folder)}
                    onRefresh={browser.refresh}
                    refreshVersion={browser.refreshVersion}
                />
            )}
        </StoryBackground>
    );
};

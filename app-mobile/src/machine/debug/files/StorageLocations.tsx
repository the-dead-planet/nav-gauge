import { useCallback, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { Button, StoryHeader, Text, Tile } from "@mobile-ui";
import {
    getStorageUsageTotals,
    StorageFolder,
    StorageFolderSummary,
} from "@mobile-apparatus";
import { StorageFolderCounts } from "./StorageFolderCounts";
import { formatFileSize } from "./file-presentation";

const descriptions: Record<string, string> = {
    "Internal app storage": "App files, caches, databases and saved settings.",
    "Image cache":
        "Workspace photos and their resized copies. Start here to inspect thumbnails.",
    "External app files": "App-specific files kept on external storage.",
    "External app cache":
        "Temporary external storage used by native libraries.",
    Recordings: "Videos saved to Downloads / NavGauge.",
};

const styles = StyleSheet.create({
    page: {
        padding: 16,
        gap: 16,
    },
    tiles: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    category: {
        minHeight: 36,
    },
});

interface Props {
    folders: StorageFolder[];
    onOpen: (folder: StorageFolder) => void;
    onRefresh: () => void;
    refreshVersion: number;
}

export const StorageLocations = ({
    folders,
    onOpen,
    onRefresh,
    refreshVersion,
}: Props) => {
    const { width, height } = useWindowDimensions();
    const [folderSummaries, setFolderSummaries] = useState<
        Record<string, StorageFolderSummary>
    >({});
    const onSummary = useCallback(
        (path: string, summary: StorageFolderSummary) => {
            setFolderSummaries((current) => ({ ...current, [path]: summary }));
        },
        [],
    );
    const totals = getStorageUsageTotals(folders, folderSummaries);
    const categories = [
        {
            label: "Downloads",
            total: totals.downloads,
        },
        {
            label: "AsyncStorage",
            total: totals.asyncStorage,
        },
        {
            label: "Image files (outside Downloads)",
            total: totals.images,
        },
        {
            label: "Remaining (excluding the above)",
            total: totals.remaining,
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.page}>
            <View style={styles.header}>
                <StoryHeader title="App files" />
                <Button size="sm" onPress={onRefresh}>
                    Refresh
                </Button>
            </View>
            <Text accessibilityLiveRegion="polite">
                {totals.counting
                    ? "Counting totals…"
                    : `${totals.total.files} files · ${formatFileSize(totals.total.bytes)} total${totals.unavailable ? " (available locations only)" : ""}`}
            </Text>
            <View>
                {categories.map(({ label, total }) => (
                    <Text key={label} usage="caption" style={styles.category}>
                        • {label}:{" "}
                        {totals.counting
                            ? "Counting…"
                            : `${total.files} files · ${formatFileSize(total.bytes)}`}
                    </Text>
                ))}
            </View>
            <View style={styles.tiles}>
                {folders.map((folder) => (
                    <Tile
                        key={folder.path}
                        name={folder.label}
                        description={descriptions[folder.label]}
                        panelProps={{
                            variant: "fill-inverse",
                            style: {
                                width: width > height ? "23%" : "48%",
                            },
                        }}
                        actions={(size, variants) => (
                            <Button
                                size={size}
                                variant={variants.active}
                                accessibilityLabel={`Browse ${folder.label}`}
                                onPress={() => onOpen(folder)}
                            >
                                Browse
                            </Button>
                        )}
                    >
                        <StorageFolderCounts
                            path={folder.path}
                            refreshVersion={refreshVersion}
                            onSummary={onSummary}
                        />
                    </Tile>
                ))}
            </View>
            <Text usage="caption">
                Totals include nested files and folders. Shortcuts are counted
                only once. Provider imports and in-memory map images may not
                have a file here.
            </Text>
        </ScrollView>
    );
};

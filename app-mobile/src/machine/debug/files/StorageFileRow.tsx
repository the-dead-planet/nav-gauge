import { StyleSheet, View } from "react-native";
import { Panel, Text } from "@mobile-ui";
import { StorageEntry } from "@mobile-apparatus";
import { formatFileSize, isImageFile } from "./file-presentation";
import { StorageFolderCounts } from "./StorageFolderCounts";
import { StorageImageThumbnail } from "./StorageImageThumbnail";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 12,
        minHeight: 64,
    },
    path: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    type: {
        width: 40,
    },
    content: {
        flex: 1,
        gap: 4,
    },
});

interface Props {
    entry: StorageEntry;
    onOpen: () => void;
    refreshVersion: number;
}

export const StorageFileRow = ({ entry, onOpen, refreshVersion }: Props) => (
    <Panel
        variant="fill-inverse"
        elevation="none"
        onPress={entry.isDirectory ? onOpen : undefined}
        accessibilityLabel={
            entry.isDirectory ? `Open folder ${entry.name}` : undefined
        }
    >
        <View style={styles.row}>
            {!entry.isDirectory && isImageFile(entry.name) ? (
                <StorageImageThumbnail
                    key={`${entry.path}:${refreshVersion}`}
                    path={entry.path}
                    name={entry.name}
                />
            ) : (
                <Text usage="caption" style={styles.type}>
                    {entry.isDirectory ? "DIR" : "FILE"}
                </Text>
            )}
            <View style={styles.content}>
                <Text bold numberOfLines={2}>
                    {entry.name}
                </Text>
                {entry.isDirectory ? (
                    <StorageFolderCounts
                        path={entry.path}
                        refreshVersion={refreshVersion}
                    />
                ) : (
                    <Text usage="caption">
                        {formatFileSize(entry.size)}
                        {entry.modified
                            ? ` · Modified ${entry.modified.toLocaleString()}`
                            : ""}
                    </Text>
                )}
            </View>
            {entry.isDirectory ? (
                <Text accessibilityElementsHidden>›</Text>
            ) : null}
        </View>
        {!entry.isDirectory ? (
            <Text usage="caption" selectable style={styles.path}>
                {entry.path}
            </Text>
        ) : null}
    </Panel>
);

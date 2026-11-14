import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { Text } from "@mobile-ui";
import {
    StorageFolderSummary,
    useStorageFolderSummary,
} from "@mobile-apparatus";
import { formatFileSize } from "./file-presentation";

const styles = StyleSheet.create({
    counts: {
        minHeight: 36,
    },
});

interface Props {
    path: string;
    refreshVersion?: number;
    onSummary?: (path: string, summary: StorageFolderSummary) => void;
}

export const StorageFolderCounts = ({
    path,
    refreshVersion,
    onSummary,
}: Props) => {
    const summary = useStorageFolderSummary(path, refreshVersion);

    useEffect(() => {
        onSummary?.(path, summary);
    }, [path, summary, onSummary]);

    return (
        <Text
            usage="caption"
            style={styles.counts}
            accessibilityLiveRegion="polite"
        >
            {summary.status === "ready"
                ? `${summary.files} files · ${summary.folders} folders · ${formatFileSize(summary.totalBytes)}`
                : summary.status === "loading"
                  ? "Counting…"
                  : summary.status === "missing"
                    ? "Not created yet"
                    : "Unavailable"}
        </Text>
    );
};

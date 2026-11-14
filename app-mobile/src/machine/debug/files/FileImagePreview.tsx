import { useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Dialog, Text } from "@mobile-ui";
import { StorageEntry } from "@mobile-apparatus";

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 240,
    },
});

interface Props {
    entry: StorageEntry;
    onClose: () => void;
}

export const FileImagePreview = ({ entry, onClose }: Props) => {
    const [error, setError] = useState<string | null>(null);

    return (
        <Dialog header={entry.name} closeText="Close preview" onClose={onClose}>
            <Image
                source={{ uri: `file://${entry.path}` }}
                style={styles.image}
                resizeMode="contain"
                accessibilityLabel={`Preview of ${entry.name}`}
                onError={(event) => setError(event.nativeEvent.error)}
            />
            {error ? (
                <Text color="glitch" accessibilityRole="alert">
                    {error}
                </Text>
            ) : null}
        </Dialog>
    );
};

import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "@mobile-ui";

const styles = StyleSheet.create({
    frame: {
        width: 72,
        height: 72,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

interface Props {
    path: string;
    name: string;
}

export const StorageImageThumbnail = ({ path, name }: Props) => {
    const [failed, setFailed] = useState(false);

    return (
        <View style={styles.frame}>
            {failed ? (
                <Text usage="caption" align="center">
                    Image unavailable
                </Text>
            ) : (
                <Image
                    source={{ uri: `file://${path}` }}
                    style={styles.image}
                    resizeMode="contain"
                    resizeMethod="resize"
                    accessibilityLabel={`Thumbnail of ${name}`}
                    onError={() => setFailed(true)}
                />
            )}
        </View>
    );
};

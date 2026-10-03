import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ColorButton } from "./ColorButton";
import { SizeVariant } from "@ui";
import { Text } from "../../typography";

const styles = StyleSheet.create({
    container: {
        gap: 8,
        padding: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});

const sizes: SizeVariant[] = ['xs', 'sm', 'md'];

export const ColorButtons: FC = () => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <View style={styles.container}>
            {sizes.map((size, i) => (
                <View key={size} style={styles.row}>
                    <ColorButton label={size} size={size} value='rgb(255, 102, 0)' selected={selectedIndex === i} onPress={() => setSelectedIndex(i)} />
                    <Text>{size}</Text>
                </View>
            ))}
        </View>
    );
};

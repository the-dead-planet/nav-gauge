import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ColorButton } from "./ColorButton";

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 24,
    },
});

export const Colors: FC = () => (
    <View style={styles.row}>
        <ColorButton value="#336699" />
        <ColorButton value="rgb(255, 102, 0)" selected />
        <ColorButton value="rgba(67, 105, 255, 0.5)" size="md" />
        <ColorButton value="#888888" disabled />
    </View>
);

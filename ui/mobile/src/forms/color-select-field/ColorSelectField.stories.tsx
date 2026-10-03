import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ColorSelectField } from "./ColorSelectField";

const styles = StyleSheet.create({
    container: {
        padding: 48,
    },
});

export const Interactive: FC = () => {
    const [value, setValue] = useState('rgba(67, 105, 255, 0.75)');

    return (
        <View style={styles.container}>
            <ColorSelectField
                label="Color"
                opacityLabel="Opacity"
                value={value}
                onChange={setValue}
            />
        </View>
    );
};

import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@mobile-ui";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
    },
});

interface Props {
    onNavigateBack: () => void;
}

export const NotFoundScreen: FC<Props> = ({ onNavigateBack }) => (
        <View style={styles.container}>
            <TouchableOpacity accessibilityRole="button" onPress={onNavigateBack}>
                <Text color="primary" shade={400}>{"< Back"}</Text>
            </TouchableOpacity>
            <Text>This is lost.</Text>
            <Text>Cannot find what you're looking for.</Text>
        </View>
);

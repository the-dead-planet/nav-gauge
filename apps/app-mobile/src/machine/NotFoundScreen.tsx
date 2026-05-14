import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 20,
    },
    text: {
        fontSize: 16,
    }
});

interface Props {
    onNavigateBack: () => void;
}

export const NotFoundScreen: FC<Props> = ({ onNavigateBack }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onNavigateBack}>
                <Text style={[{ color: theme.color('blue', 400) }]}>{"< Back"}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>This is lost. </Text>
            <Text style={styles.text}>Cannot find what you're looking for.</Text>
        </View>
    );
};

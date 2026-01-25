import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";
import { MachineWardLayoutProps } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {children}
        </View>
    );
};

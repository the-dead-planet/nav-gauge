import { FC } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "@ui";
import { MachineWardLayoutProps } from "@apparatus";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1
    }
});

export const Layout: FC<MachineWardLayoutProps> = ({ children }) => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: appearance.surface }]}>
                <StatusBar barStyle={theme.isLight ? "dark-content" : "light-content"} />
                <View style={[styles.container, { backgroundColor: appearance.surface }]}>
                    {children}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

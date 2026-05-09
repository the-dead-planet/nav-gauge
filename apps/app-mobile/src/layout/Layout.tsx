import { FC } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeName, useTheme } from "@ui";
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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.componentColor('background') }]}>
                <StatusBar barStyle={theme.name === ThemeName.Light ? "dark-content" : "light-content"} />
                <View style={[styles.container, { backgroundColor: theme.componentColor('background') }]}>
                    {children}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

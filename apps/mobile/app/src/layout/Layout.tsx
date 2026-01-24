import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ApplicationSettingsType } from "@tinker-chest";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

interface Props {
    applicationSettings: ApplicationSettingsType;
    children?: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {children}
        </View>
    );
};

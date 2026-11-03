import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Label } from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    wide: {
        width: 160,
    },
    label: {
        width: "100%",
    },
});

interface Props {
    wide: boolean;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ wide, children }) => {
    const theme = useTheme();
    return (
        <Label
            color="primary"
            shadow={theme.isDark}
            uppercase
            align="left"
            style={wide ? styles.wide : styles.label}
        >
            {children}
        </Label>
    );
};

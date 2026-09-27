import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Label } from "@mobile-ui";

const styles = StyleSheet.create({
    wide: {
        width: 160,
    },
    label: {
        width: '100%',
    },
});

interface Props {
    wide: boolean;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ wide, children }) => (
    <Label
        color="primary"
        shade={100}
        uppercase
        align="left"
        shadow={wide}
        style={wide ? styles.wide : styles.label}
    >
        {children}
    </Label>
);

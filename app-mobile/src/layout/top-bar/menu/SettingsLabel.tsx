import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { Label } from "@mobile-ui";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    wide: {
        width: 160,
        textTransform: 'uppercase',
    },
    label: {
        width: '100%',
        textAlign: 'left',
        textTransform: 'uppercase',
    },
});

interface Props {
    wide: boolean;
    children: ReactNode;
}

export const SettingsLabel: FC<Props> = ({ wide, children }) => {
    const theme = useTheme();
    const color = theme.color('primary', 100);

    return wide
        ? <Label color="primary" shadow style={[styles.wide, { color }]}>{children}</Label>
        : <Label color="primary" style={[styles.label, { color }]}>{children}</Label>;
};

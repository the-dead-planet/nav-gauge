import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Label } from "@mobile-ui";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    label: {
        flex: 2,
        minWidth: 0,
    },
    control: {
        flex: 5,
        minWidth: 0,
    },
});

interface Props {
    label?: string;
    children: ReactNode;
}

export const AnimationControlRow: FC<Props> = ({ label, children }) => (
    <View style={styles.row}>
        <View style={styles.label}>
            {label ? <Label>{label}</Label> : null}
        </View>
        <View style={styles.control}>{children}</View>
    </View>
);

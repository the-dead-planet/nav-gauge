import { FC, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "@mobile-ui";
import { useTheme } from "@ui";
import { SettingsLabel } from "./SettingsLabel";

const styles = StyleSheet.create({
    field: {
        gap: 6,
    },
    wideField: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    label: {
        textTransform: 'uppercase',
    },
});

interface Props {
    wide: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}

export const SettingsCheckbox: FC<Props> = ({ wide, checked, onChange, children }) => {
    const theme = useTheme();

    return (
        <View style={[styles.field, wide && styles.wideField]}>
            {wide ? (
                <>
                    <SettingsLabel wide>{children}</SettingsLabel>
                    <Checkbox size="xs" color="primary" checked={checked} onChange={onChange} />
                </>
            ) : (
                <Checkbox size="xs" color="primary" checked={checked} onChange={onChange}>
                    <Text style={[styles.label, { color: theme.color('primary', 100) }]}>{children}</Text>
                </Checkbox>
            )}
        </View>
    );
};

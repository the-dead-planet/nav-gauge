import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, Text } from "@mobile-ui";
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
        fontSize: 11,
        lineHeight: 12.1,
    },
});

interface Props {
    wide: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}

export const SettingsCheckbox: FC<Props> = ({ wide, checked, onChange, children }) => (
    <View style={[styles.field, wide && styles.wideField]}>
        {wide ? (
            <>
                <SettingsLabel wide>{children}</SettingsLabel>
                <Checkbox size="xs" color="primary" checked={checked} onChange={onChange} />
            </>
        ) : (
            <Checkbox size="xs" color="primary" checked={checked} onChange={onChange}>
                <Text uppercase color="primary" shade={100} style={styles.label}>{children}</Text>
            </Checkbox>
        )}
    </View>
);

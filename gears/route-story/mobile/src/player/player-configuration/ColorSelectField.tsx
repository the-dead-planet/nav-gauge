import { FC, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@ui";
import { ColorPicker } from "@mobile-ui";

interface Props {
    label?: string;
    value: string;
    onChange: (color: string) => void;
}

export const ColorSelectField: FC<Props> = ({ label, value, onChange }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <>
            <View style={styles.field}>
                <Pressable
                    style={[styles.swatch, {
                        backgroundColor: value,
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }]}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ expanded: open }}
                    onPress={() => setOpen(true)}
                />
                {label ? <Text style={styles.label}>{label}</Text> : null}
            </View>
            <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
                    <Pressable style={[styles.modalPanel, {
                        backgroundColor: theme.color('neutral', theme.isDark ? 800 : 200),
                        borderColor: theme.color('neutral', theme.isDark ? 500 : 400),
                    }]} onPress={() => {}}>
                        <ColorPicker label={label} value={value} onChange={onChange} />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    swatch: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
    },
    label: {
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalPanel: {
        width: 260,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
});
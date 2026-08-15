import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog } from "./Dialog";
import { Button } from "../button";
import { Text } from "../typography";
import { DialogPlacement } from "@ui";

const placements: DialogPlacement[] = ['middle', 'left-drawer', 'right-drawer'];

const styles = StyleSheet.create({
    container: {
        padding: 16,
        rowGap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
});

export const Overview: FC = () => {
    const [open, setOpen] = useState<DialogPlacement | null>(null);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {placements.map((p) => (
                    <Button key={p} variant="fill" color="primary" onPress={() => setOpen(p)}>
                        {p}
                    </Button>
                ))}
            </View>

            {open && (
                <Dialog
                    header={open.replace('-', ' ')}
                    placement={open}
                    closeText='Close'
                    onClose={() => setOpen(null)}
                >
                    <View style={{ rowGap: 8 }}>
                        <Text>Dialog content for {open} placement.</Text>
                        <Text>Click Close or Save to dismiss.</Text>
                    </View>
                </Dialog>
            )}
        </View>
    );
};

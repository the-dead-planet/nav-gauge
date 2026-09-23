import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog } from "./Dialog";
import { Button } from "../button";
import { Text } from "../typography";
import { ColorVariant, DialogPlacement } from "@ui";

const placements: DialogPlacement[] = ['middle', 'left-drawer', 'right-drawer'];
const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

const styles = StyleSheet.create({
    container: {
        padding: 16,
        rowGap: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    content: {
        rowGap: 8,
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
                    <View style={styles.content}>
                        <Text>Dialog content for {open} placement.</Text>
                        <Text>Click Close or Save to dismiss.</Text>
                    </View>
                </Dialog>
            )}
        </View>
    );
};

export const TallContent: FC = () => {
    const [open, setOpen] = useState(true);
    const [color, setColor] = useState<ColorVariant>('neutral');

    return open ? (
        <Dialog
            color={color}
            header="tall content"
            placement="middle"
            closeText='Close'
            onClose={() => setOpen(false)}
        >
            <View style={styles.content}>
                <View style={styles.row}>
                    {colors.map((option) => (
                        <Button key={option} color={option} variant="fill" onPress={() => setColor(option)}>
                            {option}
                        </Button>
                    ))}
                </View>
                {Array.from({ length: 40 }, (_, i) => (
                    <Text key={i}>Long dialog content line {i + 1}.</Text>
                ))}
            </View>
        </Dialog>
    ) : null;
};

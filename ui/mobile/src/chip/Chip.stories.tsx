import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ChipColor, Icons, SizeVariant, SurfaceVariant } from "@ui";
import { Chip } from "./Chip";
import { Text } from "../typography";

const allColors: ChipColor[] = ['warning', 'success', 'error', 'info', 'neutral', 'primary', 'secondary', 'tertiary'];
const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allVariants: SurfaceVariant[] = ['fill', 'fill-inverse', 'fill-translucent', 'ghost', 'outline', 'inset'];

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
    },
});

export const ChipVariants: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        {allVariants.map((variant) => (
            <View key={variant} style={styles.row}>
                <Text>{variant}</Text>
                {allSizes.map((size) => (
                    allColors.map((color) => (
                        <Chip key={`${variant}-${size}-${color}`} variant={variant} size={size} color={color} icon={Icons.NounProject.UnderConstruction}>
                            {color}
                        </Chip>
                    ))
                ))}
            </View>
        ))}
    </ScrollView>
);

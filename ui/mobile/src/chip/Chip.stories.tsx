import { FC } from "react";
import { ChipColor, Icons, surfaceVariantOptions } from "@ui";
import { StyleSheet, View } from "react-native";
import { Chip } from "./Chip";
import { VariantGallery } from "../storybook/VariantGallery";

const semanticColors: ChipColor[] = ['warning', 'success', 'error', 'info'];

const styles = StyleSheet.create({
    semanticColors: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
});

export const Gallery: FC = () => (
    <VariantGallery
        variants={surfaceVariantOptions}
        render={({ color, size, variant }) => (
            <Chip variant={variant} size={size} color={color} icon={Icons.NounProject.UnderConstruction}>
                {color}
            </Chip>
        )}
    />
);

export const SemanticColors: FC = () => (
    <View style={styles.semanticColors}>
        {semanticColors.map((color) => (
            <Chip key={color} color={color} icon={Icons.NounProject.UnderConstruction}>
                {color}
            </Chip>
        ))}
    </View>
);

export const Playground: FC = () => <Chip icon={Icons.NounProject.UnderConstruction}>Chip</Chip>;

import { FC } from "react";
import { ChipColor, chipColorOptions, Icons, sizeOptions, surfaceVariantOptions } from "@ui";
import { Chip } from "./Chip";
import { VariantGallery } from "../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        sizes={sizeOptions}
        colors={chipColorOptions}
        variants={surfaceVariantOptions}
        render={({ color, size, variant }: { color: ChipColor; size: typeof sizeOptions[number]; variant: typeof surfaceVariantOptions[number] }) => (
            <Chip variant={variant} size={size} color={color} icon={Icons.NounProject.UnderConstruction}>
                {color}
            </Chip>
        )}
    />
);

export const Playground: FC = () => <Chip icon={Icons.NounProject.UnderConstruction}>Chip</Chip>;

import { FC } from "react";
import { Fieldset } from "./Fieldset";
import { Text } from "../../typography";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <Fieldset label={color} color={color} size={size} variant={variant}>
                <Text>Content</Text>
            </Fieldset>
        )}
    />
);

export const Playground: FC = () => <Fieldset label="Fieldset"><Text>Content</Text></Fieldset>;

import { FC, useState } from "react";
import { Checkbox } from "./Checkbox";
import { colorOptions, fillVariantOptions, sizeOptions } from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        sizes={sizeOptions}
        colors={colorOptions}
        variants={fillVariantOptions}
        render={({ color, size, variant }) => (
            <Checkbox variant={variant} size={size} color={color} checked onChange={() => {}}>
                {color}
            </Checkbox>
        )}
    />
);

export const Playground: FC = () => {
    const [checked, setChecked] = useState(false);

    return <Checkbox checked={checked} onChange={setChecked}>Checkbox</Checkbox>;
};

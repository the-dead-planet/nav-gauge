import { FC, useState } from "react";
import { Checkbox } from "./Checkbox";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <Checkbox variant={variant} size={size} color={color} glyphsShade={700} highlightGlyphsShade={200} checked onChange={() => {}}>
                {color}
            </Checkbox>
        )}
    />
);

export const Playground: FC = () => {
    const [checked, setChecked] = useState(false);

    return <Checkbox glyphsShade={700} highlightGlyphsShade={200} checked={checked} onChange={setChecked}>Checkbox</Checkbox>;
};

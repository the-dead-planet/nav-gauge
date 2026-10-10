import { FC, useState } from "react";
import { Checkbox } from "./Checkbox";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <Checkbox variant={variant} size={size} color={color} contentShade={700} highlightContentShade={200} checked onChange={() => {}}>
                {color}
            </Checkbox>
        )}
    />
);

export const Playground: FC = () => {
    const [checked, setChecked] = useState(false);

    return <Checkbox contentShade={700} highlightContentShade={200} checked={checked} onChange={setChecked}>Checkbox</Checkbox>;
};

import { FC, useState } from "react";
import { Radio } from "./Radio";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Playground: FC = () => {
    const [checked, setChecked] = useState(false);

    return <Radio checked={checked} onChange={() => setChecked(!checked)}>Radio</Radio>;
};

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <Radio variant={variant} size={size} color={color} contentShade={700} highlightContentShade={200} checked onChange={() => {}}>
                {color}
            </Radio>
        )}
    />
);

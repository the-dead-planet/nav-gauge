import { FC, useState } from "react";
import { Slider } from "./Slider";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <Slider value={50} onChange={() => {}} color={color} size={size} variant={variant} />
        )}
    />
);

export const Playground: FC = () => {
    const [value, setValue] = useState(50);

    return <Slider contentShade={700} highlightContentShade={200} value={value} onChange={setValue} />;
};

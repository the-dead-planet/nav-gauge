import { FC, useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";
import { surfaceVariantOptions } from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";

export const Gallery: FC = () => (
    <VariantGallery
        variants={surfaceVariantOptions}
        render={({ color, size, variant }) => (
            <ToggleSwitch variant={variant} size={size} color={color} checked onChange={() => {}}>
                {color}
            </ToggleSwitch>
        )}
    />
);

export const Playground: FC = () => {
    const [checked, setChecked] = useState(false);

    return <ToggleSwitch contentShade={700} highlightContentShade={200} checked={checked} onChange={setChecked}>Toggle switch</ToggleSwitch>;
};

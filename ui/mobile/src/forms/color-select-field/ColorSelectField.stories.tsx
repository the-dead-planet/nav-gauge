import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    colorSelectFieldStoryArgs,
    colorSelectFieldStoryControls,
    fillVariantOptions,
    useTheme,
} from "@ui";
import { ColorSelectField } from "./ColorSelectField";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveColorSelectField = (
    args: ComponentProps<typeof ColorSelectField>,
) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorSelectField {...args} value={value} onChange={setValue} />;
};

const Gallery = (args: ComponentProps<typeof ColorSelectField>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <InteractiveColorSelectField
                    {...args}
                    value={theme.color(color)}
                    size={size}
                    variant={variant}
                />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof ColorSelectField>> = {
    args: {
        ...colorSelectFieldStoryArgs,
        onChange: () => {},
    },
    controls: colorSelectFieldStoryControls,
    galleryEditableControls: ["label", "opacityLabel", "disabled"],
    renderPlayground: (args) => <InteractiveColorSelectField {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};

export default story;

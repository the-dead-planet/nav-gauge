import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    colorPickerStoryArgs,
    colorPickerStoryControls,
    fillVariantOptions,
    useTheme,
} from "@ui";
import { ColorPicker } from "./ColorPicker";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveColorPicker = (args: ComponentProps<typeof ColorPicker>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorPicker {...args} value={value} onChange={setValue} />;
};

const Gallery = (args: ComponentProps<typeof ColorPicker>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <InteractiveColorPicker
                    {...args}
                    value={theme.color(color)}
                    size={size}
                    variant={variant}
                />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof ColorPicker>> = {
    args: {
        ...colorPickerStoryArgs,
        onChange: () => {},
    },
    controls: colorPickerStoryControls,
    galleryEditableControls: ["label", "opacityLabel", "disabled"],
    renderPlayground: (args) => <InteractiveColorPicker {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};

export default story;

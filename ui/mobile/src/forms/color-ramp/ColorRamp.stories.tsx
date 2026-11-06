import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    colorRampStoryArgs,
    colorRampStoryControls,
    useTheme,
} from "@ui";
import { ColorRamp } from "./ColorRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveColorRamp = (args: ComponentProps<typeof ColorRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorRamp {...args} value={value} onChange={setValue} />;
};

const Gallery = (args: ComponentProps<typeof ColorRamp>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={["default"]}
            render={({ color, size }) => (
                <InteractiveColorRamp
                    {...args}
                    value={theme.color(color)}
                    size={size}
                />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof ColorRamp>> = {
    args: {
        ...colorRampStoryArgs,
        onChange: () => {},
    },
    controls: colorRampStoryControls,
    galleryEditableControls: ["label", "opacityLabel", "disabled"],
    renderPlayground: (args) => <InteractiveColorRamp {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};

export default story;

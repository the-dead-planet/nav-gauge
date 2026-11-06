import { ComponentProps, useEffect, useState } from "react";
import {
    appearanceColorOptions,
    opacityRampStoryArgs,
    opacityRampStoryControls,
    useTheme,
} from "@ui";
import { OpacityRamp } from "./OpacityRamp";
import { VariantGallery } from "../../storybook/VariantGallery";
import { MobileStoryDefinition } from "../../storybook/model";

const InteractiveOpacityRamp = (args: ComponentProps<typeof OpacityRamp>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <OpacityRamp {...args} value={value} onChange={setValue} />;
};

const Gallery = (args: ComponentProps<typeof OpacityRamp>) => {
    const theme = useTheme();
    return (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={["default"]}
            render={({ color, size }) => (
                <InteractiveOpacityRamp
                    {...args}
                    color={theme.color(color)}
                    size={size}
                />
            )}
        />
    );
};

const story: MobileStoryDefinition<ComponentProps<typeof OpacityRamp>> = {
    args: {
        ...opacityRampStoryArgs,
        onChange: () => {},
    },
    controls: opacityRampStoryControls,
    galleryEditableControls: ["label", "value", "disabled"],
    renderPlayground: (args) => <InteractiveOpacityRamp {...args} />,
    renderGallery: (args) => <Gallery {...args} />,
};

export default story;

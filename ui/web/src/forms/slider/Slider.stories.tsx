import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { ComponentProps, useState } from "react";
import {
    appearanceColorOptions,
    fillVariantOptions,
    sliderStoryArgs,
    sliderStoryControls,
} from "@ui";
import { Slider } from "./Slider";
import { VariantGallery } from "../../storybook/VariantGallery";

const StorySlider = (args: ComponentProps<typeof Slider>) => {
    const [value, setValue] = useState(args.value);
    const [previousValue, setPreviousValue] = useState(args.value);
    if (previousValue !== args.value) {
        setPreviousValue(args.value);
        setValue(args.value);
    }
    return <Slider {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/Slider",
    component: Slider,
    args: sliderStoryArgs,
    argTypes: {
        ...sliderStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Slider: StorySlider } },
    code: `import { Slider } from '@web-ui';

export default Slider;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <StorySlider
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

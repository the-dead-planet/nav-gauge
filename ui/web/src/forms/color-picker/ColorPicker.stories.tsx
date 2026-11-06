import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    colorPickerStoryArgs,
    colorPickerStoryControls,
    fillVariantOptions,
    useTheme,
} from "@ui";
import { ColorPicker } from "./ColorPicker";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveColorPicker = (args: ComponentProps<typeof ColorPicker>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorPicker {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorPicker",
    component: ColorPicker,
    args: {
        ...colorPickerStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorPickerStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveColorPicker {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorPicker } },
    code: `import { useEffect, useState } from 'react';
import { ColorPicker } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorPicker {...args} value={value} onChange={setValue} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        value: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => {
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
    },
};

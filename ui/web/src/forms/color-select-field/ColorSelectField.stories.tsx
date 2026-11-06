import { ComponentProps, useEffect, useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    colorSelectFieldStoryArgs,
    colorSelectFieldStoryControls,
    fillVariantOptions,
    useTheme,
} from "@ui";
import { ColorSelectField } from "./ColorSelectField";
import { VariantGallery } from "../../storybook/VariantGallery";

const InteractiveColorSelectField = (
    args: ComponentProps<typeof ColorSelectField>,
) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorSelectField {...args} value={value} onChange={setValue} />;
};

const meta = {
    title: "Forms/ColorSelectField",
    component: ColorSelectField,
    args: {
        ...colorSelectFieldStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorSelectFieldStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorSelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <InteractiveColorSelectField {...args} />,
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorSelectField } },
    code: `import { useEffect, useState } from 'react';
import { ColorSelectField } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);
    return <ColorSelectField {...args} value={value} onChange={setValue} />;
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
                    <InteractiveColorSelectField
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

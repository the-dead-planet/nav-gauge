import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    colorInputStoryArgs,
    colorInputStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorInput } from "./ColorInput";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorInput",
    component: ColorInput,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onChange: (value: string) => updateArgs({ value }),
                    }}
                />
            );
        },
    ],
    args: {
        ...colorInputStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorInputStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorInput } },
    code: `import { ColorInput } from '@web-ui';

export default ColorInput;`,
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
                <ColorInput
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

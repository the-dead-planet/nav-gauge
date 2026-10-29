import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    radioStoryArgs,
    radioStoryControls,
    fillVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { Radio } from "./Radio";

const meta = {
    title: "Forms/Radio",
    component: Radio,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onChange: (checked: boolean) => updateArgs({ checked }),
                    }}
                />
            );
        },
    ],
    args: {
        ...radioStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...radioStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Radio } },
    code: `import { Radio } from '@web-ui';

export default Radio;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        children: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <Radio {...args} color={color} variant={variant} size={size}>
                    {color}
                </Radio>
            )}
        />
    ),
};

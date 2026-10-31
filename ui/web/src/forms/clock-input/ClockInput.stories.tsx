import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    clockStoryArgs,
    clockStoryControls,
    fillVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { ClockInput } from "./ClockInput";

const meta = {
    title: "Forms/ClockInput",
    component: ClockInput,
    args: clockStoryArgs,
    argTypes: {
        ...clockStoryControls,
        onChange: { control: false },
    },
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onChange: (value: number) => updateArgs({ value }),
                    }}
                />
            );
        },
    ],
} satisfies Meta<typeof ClockInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ClockInput } },
    code: `import { ClockInput } from '@web-ui';

export default ClockInput;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        label: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant, size }) => (
                <ClockInput
                    {...args}
                    color={color}
                    variant={variant}
                    size={size}
                    label={color}
                />
            )}
        />
    ),
};

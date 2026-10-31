import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    clockSliceStoryArgs,
    clockStoryControls,
    fillVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { ClockSliceInput } from "./ClockSliceInput";

const meta = {
    title: "Forms/ClockSliceInput",
    component: ClockSliceInput,
    args: clockSliceStoryArgs,
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
} satisfies Meta<typeof ClockSliceInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ClockSliceInput } },
    code: `import { ClockSliceInput } from '@web-ui';

export default ClockSliceInput;`,
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
                <ClockSliceInput
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

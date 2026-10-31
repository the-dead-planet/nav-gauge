import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    clockDurationStoryArgs,
    clockDurationStoryControls,
    fillVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { ClockDurationInput } from "./ClockDurationInput";

const meta = {
    title: "Forms/ClockDurationInput",
    component: ClockDurationInput,
    args: clockDurationStoryArgs,
    argTypes: {
        ...clockDurationStoryControls,
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
} satisfies Meta<typeof ClockDurationInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ClockDurationInput } },
    code: `import { ClockDurationInput } from '@web-ui';

export default ClockDurationInput;`,
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
            render={({ color, variant, size }) => (
                <ClockDurationInput
                    {...args}
                    color={color}
                    variant={variant}
                    size={size}
                />
            )}
        />
    ),
};

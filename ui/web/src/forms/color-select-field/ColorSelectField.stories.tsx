import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    DEFAULT_COLOR,
    colorSelectFieldStoryArgs,
    colorSelectFieldStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorSelectField } from "./ColorSelectField";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorSelectField",
    component: ColorSelectField,
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
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorSelectField } },
    code: `import { ColorSelectField } from '@web-ui';

export default ColorSelectField;`,
});

export const Gallery: Story = {
    argTypes: {
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={fillVariantOptions}
            render={({ size, variant }) => (
                <ColorSelectField {...args} size={size} variant={variant} />
            )}
        />
    ),
};

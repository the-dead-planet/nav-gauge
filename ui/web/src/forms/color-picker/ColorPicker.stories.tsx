import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    DEFAULT_COLOR,
    colorPickerStoryArgs,
    colorPickerStoryControls,
    fillVariantOptions,
} from "@ui";
import { ColorPicker } from "./ColorPicker";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorPicker",
    component: ColorPicker,
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
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorPicker } },
    code: `import { ColorPicker } from '@web-ui';

export default ColorPicker;`,
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
                <ColorPicker {...args} size={size} variant={variant} />
            )}
        />
    ),
};

import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    colorRampStoryArgs,
    colorRampStoryControls,
} from "@ui";
import { ColorRamp } from "./ColorRamp";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorRamp",
    component: ColorRamp,
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
        ...colorRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...colorRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof ColorRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorRamp } },
    code: `import { ColorRamp } from '@web-ui';

export default ColorRamp;`,
});

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={[DEFAULT_VARIANT]}
            render={({ size }) => <ColorRamp {...args} size={size} />}
        />
    ),
};

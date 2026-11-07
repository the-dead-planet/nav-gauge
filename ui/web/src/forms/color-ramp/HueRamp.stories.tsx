import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    hueRampStoryArgs,
    hueRampStoryControls,
} from "@ui";
import { HueRamp } from "./HueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorRampHue",
    component: HueRamp,
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
    args: {
        ...hueRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...hueRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof HueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { HueRamp } },
    code: `import { HueRamp } from '@web-ui';

export default HueRamp;`,
});

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={[DEFAULT_VARIANT]}
            render={({ size }) => <HueRamp {...args} size={size} />}
        />
    ),
};

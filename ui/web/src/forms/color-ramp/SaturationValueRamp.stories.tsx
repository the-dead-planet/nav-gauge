import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    DEFAULT_COLOR,
    DEFAULT_VARIANT,
    saturationValueRampStoryArgs,
    saturationValueRampStoryControls,
} from "@ui";
import { SaturationValueRamp } from "./SaturationValueRamp";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorRampSaturation",
    component: SaturationValueRamp,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onChange: (saturation: number, brightness: number) =>
                            updateArgs({ saturation, brightness }),
                    }}
                />
            );
        },
    ],
    args: {
        ...saturationValueRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...saturationValueRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof SaturationValueRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { SaturationValueRamp } },
    code: `import { SaturationValueRamp } from '@web-ui';

export default SaturationValueRamp;`,
});

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={[DEFAULT_COLOR]}
            variants={[DEFAULT_VARIANT]}
            render={({ size }) => <SaturationValueRamp {...args} size={size} />}
        />
    ),
};

import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    DEFAULT_VARIANT,
    opacityRampStoryArgs,
    opacityRampStoryControls,
    useTheme,
} from "@ui";
import { OpacityRamp } from "./OpacityRamp";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorRampOpacity",
    component: OpacityRamp,
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
        ...opacityRampStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...opacityRampStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof OpacityRamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { OpacityRamp } },
    code: `import { OpacityRamp } from '@web-ui';

export default OpacityRamp;`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
    },
    render: (args) => {
        const theme = useTheme();
        return (
            <VariantGallery
                size={args.size}
                colors={appearanceColorOptions}
                variants={[DEFAULT_VARIANT]}
                render={({ color, size }) => (
                    <OpacityRamp
                        {...args}
                        color={theme.color(color)}
                        size={size}
                    />
                )}
            />
        );
    },
};

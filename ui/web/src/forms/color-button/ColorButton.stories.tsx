import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    colorButtonStoryArgs,
    colorButtonStoryControls,
    DEFAULT_VARIANT,
    useTheme,
} from "@ui";
import { ColorButton } from "./ColorButton";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorButton",
    component: ColorButton,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onClick: () =>
                            updateArgs({ selected: !context.args.selected }),
                    }}
                />
            );
        },
    ],
    args: colorButtonStoryArgs,
    argTypes: {
        ...colorButtonStoryControls,
        onClick: { control: false },
    },
} satisfies Meta<typeof ColorButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorButton } },
    code: `import { ColorButton } from '@web-ui';

export default ColorButton;`,
});

export const Gallery: Story = {
    argTypes: {
        value: { table: { disable: true } },
    },
    render: (args) => {
        const theme = useTheme();
        return (
            <VariantGallery
                size={args.size}
                colors={appearanceColorOptions}
                variants={[DEFAULT_VARIANT]}
                render={({ color, size }) => (
                    <ColorButton
                        {...args}
                        size={size}
                        value={theme.color(color)}
                    />
                )}
            />
        );
    },
};

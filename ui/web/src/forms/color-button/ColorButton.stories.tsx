import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    colorButtonStoryArgs,
    colorButtonStoryControls,
    useTheme,
} from "@ui";
import { ColorButton } from "./ColorButton";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/ColorButton",
    component: ColorButton,
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
                variants={["default"]}
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

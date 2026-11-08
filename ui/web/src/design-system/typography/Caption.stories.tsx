import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    surfaceVariantOptions,
    typographyStoryArgs,
    typographyStoryControls,
} from "@ui";
import { Caption } from "./Caption";
import { VariantGallery } from "../../storybook/VariantGallery";

const { usage: _usage, ...args } = typographyStoryArgs;
const { usage: _usageControl, ...controls } = typographyStoryControls;

const meta = {
    title: "Design System/Caption",
    component: Caption,
    args,
    argTypes: controls,
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": {
            Caption,
        },
    },
    code: `import { Caption } from '@web-ui';

export default Caption;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: {
            table: {
                disable: true,
            },
        },
        variant: {
            table: {
                disable: true,
            },
        },
    },
    render: (props) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, variant }) => (
                <Caption {...props} color={color} variant={variant} />
            )}
        />
    ),
};

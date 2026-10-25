import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    chipStoryArgs,
    chipStoryControls,
    Icons,
    sizeOptions,
    surfaceVariantOptions,
} from "@ui";
import { Chip } from "./Chip";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Gizmos/Chip",
    component: Chip,
    args: {
        ...chipStoryArgs,
        icon: Icons.NounProject.UnderConstruction,
    },
    argTypes: {
        ...chipStoryControls,
        icon: {
            control: "select",
            options: ["None", "Construction"],
            mapping: {
                None: undefined,
                Construction: Icons.NounProject.UnderConstruction,
            },
        },
    },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Chip } },
    code: `import { Chip } from '@web-ui';

export default Chip;`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        size: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            sizes={sizeOptions}
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Chip {...args} color={color} size={size} variant={variant} />
            )}
        />
    ),
};

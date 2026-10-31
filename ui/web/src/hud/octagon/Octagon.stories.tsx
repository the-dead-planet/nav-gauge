import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    octagonStoryArgs,
    octagonStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { Octagon } from "./Octagon";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta: Meta<typeof Octagon> = {
    title: "Hud/Octagon",
    component: Octagon,
    args: octagonStoryArgs,
    argTypes: octagonStoryControls,
};
export default meta;
type Story = StoryObj<typeof Octagon>;

export const Playground: Story = { name: "Playground with Live code editor" };
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Octagon } },
    code: `import { Octagon } from '@web-ui';

export default function Example(args) {
    return <Octagon {...args} tabIndex={args.interactive ? 0 : undefined} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={surfaceVariantOptions}
            render={({ color, size, variant }) => (
                <Octagon
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    tabIndex={args.interactive ? 0 : undefined}
                />
            )}
        />
    ),
};

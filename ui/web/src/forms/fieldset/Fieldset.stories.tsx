import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fieldsetStoryArgs,
    fieldsetStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { Fieldset } from "./Fieldset";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Forms/Fieldset",
    component: Fieldset,
    args: fieldsetStoryArgs,
    argTypes: {
        ...fieldsetStoryControls,
        prepend: { control: false },
        append: { control: false },
        onExpandedChange: { control: false },
    },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Fieldset } },
    code: `import { Fieldset } from '@web-ui';

export default Fieldset;`,
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
                <Fieldset
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

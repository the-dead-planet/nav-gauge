import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    sizeOptions,
    tooltipStoryArgs,
    tooltipStoryControls,
} from "@ui";
import { Tooltip } from "./Tooltip";
import { Button } from "../button";
import { VariantGallery } from "../../storybook/VariantGallery";

const meta = {
    title: "Gizmos/Tooltip",
    component: Tooltip,
    args: {
        ...tooltipStoryArgs,
        children: <Button>Hover, focus or long press</Button>,
    },
    argTypes: {
        ...tooltipStoryControls,
        children: { control: false },
    },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Tooltip, Button } },
    code: `import { Tooltip, Button } from '@web-ui';

export default (props) => <Tooltip {...props}><Button>Hover, focus or long press</Button></Tooltip>;`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        size: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            colors={appearanceColorOptions}
            sizes={sizeOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <Tooltip {...args} color={color} size={size} variant={variant}>
                    <Button color={color}>{color}</Button>
                </Tooltip>
            )}
        />
    ),
};

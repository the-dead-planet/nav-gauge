import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { tileStoryArgs } from "@ui";
import { Button } from "../../gizmos/button";
import { colorOptions, fillVariantOptions } from "../../storybook/controls";
import { VariantGallery } from "../../storybook/VariantGallery";
import { Tile } from "./Tile";

const meta = {
    title: "Assemblies/Tile",
    component: Tile,
    args: {
        ...tileStoryArgs,
        append: <Button size="xs">Info</Button>,
        children: <div style={{ minHeight: 80 }} />,
        actions: <Button variant="fill">Open</Button>,
        panelProps: { variant: "fill-inverse" },
    },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
    render: (args) => (
        <VariantGallery
            sizes={["sm"]}
            colors={colorOptions}
            variants={fillVariantOptions}
            render={({ color, variant }) => (
                <Tile
                    {...args}
                    panelProps={{ ...args.panelProps, color, variant }}
                    actions={<Button variant="fill">Open</Button>}
                />
            )}
        />
    ),
};

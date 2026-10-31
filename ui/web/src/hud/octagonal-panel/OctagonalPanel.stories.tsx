import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    octagonalPanelStoryArgs,
    octagonalPanelStoryControls,
} from "@ui";
import { OctagonalPanel } from "./OctagonalPanel";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof OctagonalPanel> = {
    title: "Hud/OctagonalPanel",
    component: OctagonalPanel,
    args: { ...octagonalPanelStoryArgs, contentClassName: styles.sample },
    argTypes: octagonalPanelStoryControls,
};
export default meta;
type Story = StoryObj<typeof OctagonalPanel>;

export const Playground: Story = { name: "Playground with Live code editor" };
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { OctagonalPanel } },
    code: `import { OctagonalPanel } from '@web-ui';

export default OctagonalPanel;`,
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
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <OctagonalPanel
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

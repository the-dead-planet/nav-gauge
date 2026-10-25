import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    bevelPanelStoryArgs,
    bevelPanelStoryControls,
    fillVariantOptions,
    sizeOptions,
} from "@ui";
import { BevelPanel } from "./BevelPanel";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof BevelPanel> = {
    title: "Hud/BevelPanel",
    component: BevelPanel,
    args: bevelPanelStoryArgs,
    argTypes: bevelPanelStoryControls,
};
export default meta;
type Story = StoryObj<typeof BevelPanel>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <BevelPanel {...args} tabIndex={args.interactive ? 0 : undefined}>
            <div className={styles.sample}>{args.children}</div>
        </BevelPanel>
    ),
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { BevelPanel } },
    code: `import { BevelPanel } from '@web-ui';

export default () => <BevelPanel>Preview</BevelPanel>;`,
});

export const Gallery: Story = {
    parameters: { controls: { exclude: ["color", "variant", "size"] } },
    render: (args) => (
        <VariantGallery
            sizes={sizeOptions}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <BevelPanel
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    tabIndex={args.interactive ? 0 : undefined}
                >
                    <div className={styles.sample}>{args.children}</div>
                </BevelPanel>
            )}
        />
    ),
};

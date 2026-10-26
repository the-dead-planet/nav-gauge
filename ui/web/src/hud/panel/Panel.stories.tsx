import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    panelStoryArgs,
    panelStoryControls,
} from "@ui";
import { Panel } from "./Panel";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof Panel> = {
    title: "Hud/Panel",
    component: Panel,
    args: panelStoryArgs,
    argTypes: panelStoryControls,
};
export default meta;
type Story = StoryObj<typeof Panel>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <Panel {...args} tabIndex={args.interactive ? 0 : undefined}>
            <div className={styles.sample}>{args.children}</div>
        </Panel>
    ),
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Panel } },
    code: `import { Panel } from '@web-ui';

export default () => <Panel>Preview</Panel>;`,
});

export const Gallery: Story = {
    parameters: { controls: { exclude: ["color", "variant"] } },
    render: (args) => (
        <VariantGallery
            sizes={["surface"]}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, variant }) => (
                <Panel
                    {...args}
                    color={color}
                    variant={variant}
                    tabIndex={args.interactive ? 0 : undefined}
                >
                    <div className={styles.sample}>{args.children}</div>
                </Panel>
            )}
        />
    ),
};

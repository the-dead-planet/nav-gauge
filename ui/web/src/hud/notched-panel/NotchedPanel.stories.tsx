import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    notchedPanelStoryArgs,
    notchedPanelStoryControls,
} from "@ui";
import { NotchedPanel } from "./NotchedPanel";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof NotchedPanel> = {
    title: "Hud/NotchedPanel",
    component: NotchedPanel,
    args: notchedPanelStoryArgs,
    argTypes: notchedPanelStoryControls,
};
export default meta;
type Story = StoryObj<typeof NotchedPanel>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <NotchedPanel {...args} tabIndex={args.interactive ? 0 : undefined}>
            <div className={styles.sample}>{args.children}</div>
        </NotchedPanel>
    ),
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { NotchedPanel } },
    code: `import { NotchedPanel } from '@web-ui';

export default () => <NotchedPanel header="Navigation">Preview</NotchedPanel>;`,
});

export const Gallery: Story = {
    parameters: { controls: { exclude: ["color", "variant", "header"] } },
    render: (args) => (
        <div className={styles.gallery}>
            {[false, true].map((hasHeader) => (
                <section key={String(hasHeader)}>
                    <h2>{hasHeader ? "With header" : "Without header"}</h2>
                    <VariantGallery
                        colors={appearanceColorOptions}
                        variants={fillVariantOptions}
                        render={({ color, variant }) => (
                            <NotchedPanel
                                {...args}
                                color={color}
                                variant={variant}
                                header={hasHeader ? "Navigation" : undefined}
                                tabIndex={args.interactive ? 0 : undefined}
                            >
                                <div className={styles.sample}>
                                    {args.children}
                                </div>
                            </NotchedPanel>
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};

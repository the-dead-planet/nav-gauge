import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    hudDecorationCornerSets,
    hudDecorationStoryArgs,
    hudDecorationStoryControls,
} from "@ui";
import { HudDecoration } from "./HudDecoration";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof HudDecoration> = {
    title: "Hud/HudDecoration",
    component: HudDecoration,
    args: hudDecorationStoryArgs,
    argTypes: hudDecorationStoryControls,
};
export default meta;
type Story = StoryObj<typeof HudDecoration>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <div className={styles["ornament-sample"]}>
            <HudDecoration {...args}>
                <div className={styles.sample}>{args.children}</div>
            </HudDecoration>
        </div>
    ),
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { HudDecoration } },
    code: `import { HudDecoration } from '@web-ui';

export default () => <HudDecoration>Preview</HudDecoration>;`,
});

export const Gallery: Story = {
    parameters: { controls: { exclude: ["color", "corners"] } },
    render: (args) => (
        <div className={styles.gallery}>
            {hudDecorationCornerSets.map(({ label, corners }) => (
                <section key={label}>
                    <h2>{label}</h2>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={["brackets"]}
                        render={({ color, size }) => (
                            <div className={styles["ornament-sample"]}>
                                <HudDecoration
                                    {...args}
                                    color={color}
                                    size={size}
                                    corners={corners}
                                >
                                    <div className={styles.sample}>
                                        {args.children}
                                    </div>
                                </HudDecoration>
                            </div>
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};

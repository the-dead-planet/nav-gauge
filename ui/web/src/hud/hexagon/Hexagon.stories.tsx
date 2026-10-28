import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    hexagonShapes,
    hexagonStoryArgs,
    hexagonStoryControls,
    surfaceVariantOptions,
} from "@ui";
import { Hexagon } from "./Hexagon";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof Hexagon> = {
    title: "Hud/Hexagon",
    component: Hexagon,
    args: hexagonStoryArgs,
    argTypes: hexagonStoryControls,
};
export default meta;
type Story = StoryObj<typeof Hexagon>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <Hexagon {...args} tabIndex={args.interactive ? 0 : undefined} />
    ),
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Hexagon } },
    code: `import { Hexagon } from '@web-ui';

export default () => <Hexagon>H</Hexagon>;`,
});

export const Gallery: Story = {
    parameters: {
        controls: { exclude: ["color", "variant", "shape"] },
    },
    render: (args) => (
        <div className={styles.gallery}>
            {hexagonShapes.map((shape) => (
                <section key={shape}>
                    <h2>{shape}</h2>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={surfaceVariantOptions}
                        render={({ color, size, variant }) => (
                            <Hexagon
                                {...args}
                                color={color}
                                size={size}
                                variant={variant}
                                shape={shape}
                                tabIndex={args.interactive ? 0 : undefined}
                            />
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};

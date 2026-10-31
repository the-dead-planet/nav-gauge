import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    hexagonalPanelStoryArgs,
    hexagonalPanelStoryControls,
    hexagonShapes,
    fillVariantOptions,
} from "@ui";
import { HexagonalPanel } from "./HexagonalPanel";
import { VariantGallery } from "../../storybook/VariantGallery";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof HexagonalPanel> = {
    title: "Hud/HexagonalPanel",
    component: HexagonalPanel,
    args: {
        ...hexagonalPanelStoryArgs,
        contentClassName: styles.sample,
    },
    argTypes: hexagonalPanelStoryControls,
};
export default meta;
type Story = StoryObj<typeof HexagonalPanel>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { HexagonalPanel } },
    code: `import { HexagonalPanel } from '@web-ui';

export default function Example(args) {
    return <HexagonalPanel {...args} tabIndex={args.interactive ? 0 : undefined} />;
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        shape: { table: { disable: true } },
    },
    render: (args) => (
        <div className={styles.gallery}>
            {hexagonShapes.map((shape) => (
                <section key={shape}>
                    <h2>{shape}</h2>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={fillVariantOptions}
                        render={({ color, size, variant }) => (
                            <HexagonalPanel
                                {...args}
                                color={color}
                                size={size}
                                variant={variant}
                                shape={shape}
                                tabIndex={args.interactive ? 0 : undefined}
                            >
                                {args.children}
                            </HexagonalPanel>
                        )}
                    />
                </section>
            ))}
        </div>
    ),
};

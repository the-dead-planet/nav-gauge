import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    dividerStoryArgs,
    dividerStoryControls,
} from "@ui";
import { Divider } from "./Divider";
import { Text } from "../../design-system/typography";
import styles from "./divider.stories.module.css";

const meta: Meta<typeof Divider> = {
    title: "Chassis/Divider",
    component: Divider,
    args: dividerStoryArgs,
    argTypes: dividerStoryControls,
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <div className={styles.preview}>
            <Divider {...args} />
        </div>
    ),
};

makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": {
            Divider,
        },
    },
    code: `import { Divider } from '@web-ui';

export default () => <Divider />;`,
});

export const Gallery: Story = {
    parameters: {
        controls: {
            exclude: ["orientation", "color"],
        },
    },
    render: (args) => (
        <div className={styles.gallery}>
            {appearanceColorOptions.map((color) => (
                <section key={color} className={styles.section}>
                    <Text usage="header">{color}</Text>
                    <Divider {...args} color={color} orientation="horizontal" />
                    <div className={styles.preview}>
                        <Divider
                            {...args}
                            color={color}
                            orientation="vertical"
                        />
                    </div>
                </section>
            ))}
        </div>
    ),
};

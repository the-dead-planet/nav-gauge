import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { gridGalleryCases, gridStoryArgs, gridStoryControls } from "@ui";
import { Grid } from "./Grid";
import { Text } from "../../design-system/typography";
import styles from "../layout.stories.module.css";

const meta: Meta<typeof Grid> = {
    title: "Chassis/Grid",
    component: Grid,
    args: gridStoryArgs,
    argTypes: gridStoryControls,
};

export default meta;
type Story = StoryObj<typeof Grid>;

const labels = ["[1]", "[Two]", "[3]", "[Four]", "[5]", "[Six]", "[7]"];

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <Grid {...args} className={styles.preview}>
            {labels.map((label, index) => (
                <Text key={label} p={index % 2 ? "sm" : "xs"}>
                    {label}
                </Text>
            ))}
        </Grid>
    ),
};

makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": {
            Grid,
            Text,
        },
    },
    code: `import { Grid, Text } from '@web-ui';

export default () => (
    <Grid cols="equal-2" gap="sm">
        <Text>[1]</Text>
        <Text>[Two]</Text>
        <Text>[3]</Text>
    </Grid>
);`,
});

export const Gallery: Story = {
    parameters: {
        controls: {
            exclude: Object.keys(gridStoryControls),
        },
    },
    render: () => (
        <div className={styles.gallery}>
            {gridGalleryCases.map(({ label, props }) => (
                <section key={label}>
                    <Text usage="header">{label}</Text>
                    <Grid {...props} className={styles.preview}>
                        {labels.map((text, index) => (
                            <Text key={text} p={index % 2 ? "sm" : "xs"}>
                                {text}
                            </Text>
                        ))}
                    </Grid>
                </section>
            ))}
        </div>
    ),
};

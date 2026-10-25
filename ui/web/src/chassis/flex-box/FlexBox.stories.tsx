import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    flexBoxGalleryCases,
    flexBoxStoryArgs,
    flexBoxStoryControls,
} from "@ui";
import { FlexBox } from "./FlexBox";
import { Text } from "../../design-system/typography";
import styles from "../layout.stories.module.css";

const meta: Meta<typeof FlexBox> = {
    title: "Chassis/FlexBox",
    component: FlexBox,
    args: flexBoxStoryArgs,
    argTypes: flexBoxStoryControls,
};

export default meta;
type Story = StoryObj<typeof FlexBox>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => (
        <FlexBox {...args} className={styles.preview}>
            <Text p="xs">[1]</Text>
            <Text p="sm">[Two]</Text>
            <Text p="xs">[3]</Text>
        </FlexBox>
    ),
};

makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": {
            FlexBox,
            Text,
        },
    },
    code: `import { FlexBox, Text } from '@web-ui';

export default () => (
    <FlexBox gap="sm">
        <Text>[1]</Text>
        <Text>[Two]</Text>
        <Text>[3]</Text>
    </FlexBox>
);`,
});

export const Gallery: Story = {
    parameters: {
        controls: {
            exclude: Object.keys(flexBoxStoryControls),
        },
    },
    render: () => (
        <div className={styles.gallery}>
            {flexBoxGalleryCases.map(({ label, props }) => (
                <section key={label}>
                    <Text usage="header">{label}</Text>
                    <FlexBox {...props} className={styles.preview}>
                        <Text p="xs">[1]</Text>
                        <Text p="sm">[Two]</Text>
                        <Text p="xs">[3]</Text>
                    </FlexBox>
                </section>
            ))}
        </div>
    ),
};

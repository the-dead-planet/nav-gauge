import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    buttonCorners,
    checkboxStoryArgs,
    checkboxStoryControls,
    fillVariantOptions,
} from "@ui";
import { VariantGallery } from "../../storybook/VariantGallery";
import { Checkbox } from "./Checkbox";

const meta = {
    title: "Forms/Checkbox",
    component: Checkbox,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onChange: (checked: boolean) => updateArgs({ checked }),
                    }}
                />
            );
        },
    ],
    args: {
        ...checkboxStoryArgs,
        onChange: () => {},
    },
    argTypes: {
        ...checkboxStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Checkbox } },
    code: `import { Checkbox } from '@web-ui';

export default Checkbox;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
        corners: { table: { disable: true } },
        children: { table: { disable: true } },
    },
    render: (args) => (
        <>
            {buttonCorners.map((corners) => (
                <section key={corners}>
                    <h2>{corners}</h2>
                    <VariantGallery
                        size={args.size}
                        colors={appearanceColorOptions}
                        variants={fillVariantOptions}
                        render={({ color, variant, size }) => (
                            <Checkbox
                                {...args}
                                color={color}
                                variant={variant}
                                size={size}
                                corners={corners}
                            >
                                {color}
                            </Checkbox>
                        )}
                    />
                </section>
            ))}
        </>
    ),
};

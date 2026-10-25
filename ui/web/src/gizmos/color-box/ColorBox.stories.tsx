import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    allColorShades,
    appearanceColorOptions,
    colorBoxGallerySizes,
    colorBoxStoryArgs,
    colorBoxStoryControls,
    Theme,
    useTheme,
} from "@ui";
import { ColorBox } from "./ColorBox";

const meta = {
    title: "Gizmos/Color Box",
    component: ColorBox,
    args: {
        ...colorBoxStoryArgs,
    },
    argTypes: {
        ...colorBoxStoryControls,
        color: {
            control: "select",
            options: Object.keys(Theme.palette),
            mapping: Theme.palette,
        },
    },
} satisfies Meta<typeof ColorBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { ColorBox }, "@ui": { Theme } },
    code: `import { Theme } from '@ui';
import { ColorBox } from '@web-ui';

export default () => <ColorBox color={Theme.palette.copper} size={24} showPaletteOnHover />;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        size: { table: { disable: true } },
        shade: { table: { disable: true } },
        name: { table: { disable: true } },
    },
    render: (args) => {
        const theme = useTheme();
        const colors = {
            ...Theme.palette,
            ...Object.fromEntries(
                appearanceColorOptions.map((color) => [
                    color,
                    theme.colors[color],
                ]),
            ),
        };
        return (
            <div>
                {Object.entries(colors).map(([name, color]) => (
                    <section key={name}>
                        <h3>{name}</h3>
                        {colorBoxGallerySizes.map((size) => (
                            <div key={size}>
                                {allColorShades.map((shade) => (
                                    <ColorBox
                                        {...args}
                                        key={shade}
                                        name={name}
                                        color={color}
                                        size={size}
                                        shade={shade}
                                    />
                                ))}
                            </div>
                        ))}
                    </section>
                ))}
            </div>
        );
    },
};

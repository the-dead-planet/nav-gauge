import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    allColorShades,
    colorBoxStoryArgs,
    colorBoxStoryControls,
    DEFAULT_SIZE,
    Theme,
} from "@ui";
import { ColorBox } from "./ColorBox";

const meta = {
    title: "Gizmos/Color Box",
    component: ColorBox,
    args: colorBoxStoryArgs,
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

export default () => <ColorBox color={Theme.palette.copper} size="sm" showPaletteOnHover />;`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        shade: { table: { disable: true } },
        name: { table: { disable: true } },
    },
    render: (args) => (
        <table>
            <caption>Copper</caption>
            <thead>
                <tr>
                    <th scope="col">Size</th>
                    {allColorShades.map((shade) => (
                        <th key={shade} scope="col">
                            {shade}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">{args.size ?? DEFAULT_SIZE}</th>
                    {allColorShades.map((shade) => (
                        <td key={shade}>
                            <ColorBox
                                {...args}
                                name="Copper"
                                color={Theme.palette.copper}
                                shade={shade}
                            />
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    ),
};

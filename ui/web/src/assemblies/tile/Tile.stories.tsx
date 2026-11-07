import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import { useArgs } from "storybook/preview-api";
import {
    appearanceColorOptions,
    fillVariantOptions,
    TileStoryProps,
    tileStoryArgs,
    tileStoryControls,
} from "@ui";
import { Button } from "../../gizmos/button";
import { VariantGallery } from "../../storybook/VariantGallery";
import { Tile } from "./Tile";

type StoryProps = TileStoryProps & {
    onAction: () => void;
    onReset: () => void;
};

const TileExample = ({
    color,
    highlightColor,
    variant,
    highlighted,
    disabled,
    interactive,
    activeGlow,
    elevation,
    onAction,
    onReset,
    ...args
}: StoryProps) => (
    <Tile
        {...args}
        panelProps={{
            color,
            highlightColor,
            variant,
            highlighted,
            disabled,
            interactive,
            activeGlow,
            elevation,
        }}
        append={
            <Button
                size={args.size}
                color={color}
                disabled={disabled}
                onClick={onAction}
            >
                Info
            </Button>
        }
        actions={(size, variants) => [
            <Button
                key="reset"
                size={size}
                color={color}
                variant={variants.inactive}
                disabled={disabled}
                onClick={onReset}
            >
                Reset
            </Button>,
            <Button
                key="highlight"
                size={size}
                color={color}
                variant={variants.active}
                disabled={disabled}
                onClick={onAction}
            >
                Highlight
            </Button>,
        ]}
    />
);

const meta = {
    title: "Assemblies/Tile",
    component: Tile,
    decorators: [
        (Story, context) => {
            const [, updateArgs] = useArgs();
            return (
                <Story
                    args={{
                        ...context.args,
                        onAction: () =>
                            updateArgs({
                                highlighted: !context.args.highlighted,
                            }),
                        onReset: () => updateArgs({ highlighted: false }),
                    }}
                />
            );
        },
    ],
    args: {
        ...tileStoryArgs,
        onAction: () => {},
        onReset: () => {},
    },
    argTypes: {
        ...tileStoryControls,
        onAction: { control: false },
        onReset: { control: false },
    },
    render: (args) => <TileExample {...args} />,
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Tile, Button } },
    code: `import { Tile, Button } from '@web-ui';

export default function Example({ color, highlightColor, variant, highlighted, disabled, interactive, activeGlow, elevation, onAction, onReset, ...args }) {
    return (
        <Tile
            {...args}
            panelProps={{ color, highlightColor, variant, highlighted, disabled, interactive, activeGlow, elevation }}
            append={<Button size={args.size} color={color} disabled={disabled} onClick={onAction}>Info</Button>}
            actions={(size, variants) => [
                <Button key="reset" size={size} color={color} variant={variants.inactive} disabled={disabled} onClick={onReset}>Reset</Button>,
                <Button key="highlight" size={size} color={color} variant={variants.active} disabled={disabled} onClick={onAction}>Highlight</Button>,
            ]}
        />
    );
}`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <VariantGallery
            size={args.size}
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <TileExample
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                />
            )}
        />
    ),
};

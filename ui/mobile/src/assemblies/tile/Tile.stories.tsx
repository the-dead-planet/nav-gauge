import {
    TileStoryProps,
    appearanceColorOptions,
    fillVariantOptions,
    tileStoryArgs,
    tileStoryControls,
} from "@ui";
import { Button } from "../../gizmos/button";
import { MobileStoryDefinition } from "../../storybook/model";
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
                onPress={onAction}
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
                onPress={onReset}
            >
                Reset
            </Button>,
            <Button
                key="highlight"
                size={size}
                color={color}
                variant={variants.active}
                disabled={disabled}
                onPress={onAction}
            >
                Highlight
            </Button>,
        ]}
    />
);

const story: MobileStoryDefinition<TileStoryProps> = {
    args: tileStoryArgs,
    controls: tileStoryControls,
    galleryEditableControls: [
        "name",
        "description",
        "children",
        "highlightColor",
        "highlighted",
        "disabled",
        "interactive",
        "activeGlow",
        "elevation",
    ],
    renderPlayground: (args, updateArgs) => (
        <TileExample
            {...args}
            onAction={() => updateArgs({ highlighted: !args.highlighted })}
            onReset={() => updateArgs({ highlighted: false })}
        />
    ),
    renderGallery: (args, updateArgs) => (
        <VariantGallery
            colors={appearanceColorOptions}
            variants={fillVariantOptions}
            render={({ color, size, variant }) => (
                <TileExample
                    {...args}
                    color={color}
                    size={size}
                    variant={variant}
                    onAction={() =>
                        updateArgs({ highlighted: !args.highlighted })
                    }
                    onReset={() => updateArgs({ highlighted: false })}
                />
            )}
        />
    ),
};

export default story;

import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    fillVariantOptions,
    resizeHandleDirections,
    resizeHandleStoryArgs,
    resizeHandleStoryControls,
} from "@ui";
import { ResizeHandle } from "./ResizeHandle";
import { ResizeHandleDemo } from "./ResizeHandleDemo";
import styles from "./resize-handle.stories.module.css";

const meta = {
    title: "Gizmos/Resize Handle",
    component: ResizeHandle,
    args: {
        ...resizeHandleStoryArgs,
        onDrag: () => undefined,
    },
    argTypes: {
        ...resizeHandleStoryControls,
        onDrag: { control: false },
        onDragStart: { control: false },
        onDragEnd: { control: false },
    },
} satisfies Meta<typeof ResizeHandle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
    render: (args) => <ResizeHandleDemo {...args} />,
};
makeLiveEditStory(Playground, {
    availableImports: { "./ResizeHandleDemo": { ResizeHandleDemo } },
    code: `import { ResizeHandleDemo } from './ResizeHandleDemo';

export default ResizeHandleDemo;`,
});

export const Gallery: Story = {
    argTypes: {
        color: { table: { disable: true } },
        direction: { table: { disable: true } },
        side: { table: { disable: true } },
        variant: { table: { disable: true } },
    },
    render: (args) => (
        <div>
            {fillVariantOptions.map((variant) => (
                <section key={variant}>
                    <h2>{variant}</h2>
                    <div className={styles.gallery}>
                        {resizeHandleDirections.flatMap((direction) =>
                            appearanceColorOptions.flatMap((color) =>
                                (direction === "horizontal"
                                    ? (["left", "right"] as const)
                                    : (["top"] as const)
                                ).map((side) => (
                                    <ResizeHandleDemo
                                        {...args}
                                        key={`${direction}-${color}-${side}`}
                                        variant={variant}
                                        direction={direction}
                                        side={side}
                                        color={color}
                                    />
                                )),
                            ),
                        )}
                    </div>
                </section>
            ))}
        </div>
    ),
};

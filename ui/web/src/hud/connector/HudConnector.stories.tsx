import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    hudConnectorAnchors,
    hudConnectorStoryArgs,
    hudConnectorStoryControls,
} from "@ui";
import { HudConnector } from "./HudConnector";
import { HudConnectorExample } from "./HudConnectorExample";
import { Panel } from "../panel";
import styles from "../hud.stories.module.css";

const meta: Meta<typeof HudConnectorExample> = {
    title: "Hud/HudConnector",
    component: HudConnectorExample,
    args: hudConnectorStoryArgs,
    argTypes: hudConnectorStoryControls,
};
export default meta;
type Story = StoryObj<typeof HudConnectorExample>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};
makeLiveEditStory(Playground, {
    availableImports: {
        "@web-ui": { HudConnector, Panel },
    },
    code: `import { useRef } from 'react';
import { HudConnector, Panel } from '@web-ui';

export default () => {
    const fromRef = useRef(null);
    const toRef = useRef(null);
    return (
        <HudConnector fromRef={fromRef} toRef={toRef}>
            <Panel ref={fromRef}>From</Panel>
            <Panel ref={toRef}>To</Panel>
        </HudConnector>
    );
};`,
});

export const Gallery: Story = {
    parameters: { controls: { exclude: ["color", "fromAnchor", "toAnchor"] } },
    render: (args) => (
        <div className={styles.gallery}>
            {appearanceColorOptions.map((color) => (
                <section key={color}>
                    <h2>{color}</h2>
                    {hudConnectorAnchors.map((fromAnchor, index) => (
                        <HudConnectorExample
                            key={fromAnchor}
                            {...args}
                            color={color}
                            fromAnchor={fromAnchor}
                            toAnchor={
                                hudConnectorAnchors[
                                    (index + 4) % hudConnectorAnchors.length
                                ]
                            }
                        />
                    ))}
                </section>
            ))}
        </div>
    ),
};

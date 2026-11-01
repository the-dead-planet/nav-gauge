import { ComponentProps, useEffect, useRef, useState } from "react";
import * as React from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { makeLiveEditStory } from "storybook-addon-code-editor";
import {
    appearanceColorOptions,
    dropdownStoryArgs,
    dropdownStoryControls,
    fillVariantOptions,
    Icons,
    Theme,
} from "@ui";
import { ColorBox } from "../../gizmos/color-box";
import { Popup } from "../../rigs/popup";
import { VariantGallery } from "../../storybook/VariantGallery";
import { Dropdown } from "./Dropdown";
import { Button } from "../../gizmos/button";

const options = [
    { value: "brass", label: "Brass Cog", icon: Icons.Beaker },
    { value: "copper", label: "Copper Valve", icon: Icons.Beaker },
    { value: "steam", label: "Steam Pipe", prepend: <ColorBox size="xs" color={Theme.palette["neutral-grey"]} /> },
    { value: "gear", label: "Gear Assembly", icon: Icons.Beaker },
];

const StoryDropdown = (args: ComponentProps<typeof Dropdown>) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => setValue(args.value), [args.value]);

    return (
        <Dropdown
            {...args}
            ariaLabel="Select material"
            value={value}
            onChange={setValue}
        />
    );
};

const meta = {
    title: "Forms/Dropdown",
    component: Dropdown,
    args: {
        ...dropdownStoryArgs,
        options,
        onChange: () => { },
    },
    argTypes: {
        ...dropdownStoryControls,
        onChange: { control: false },
    },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    name: "Playground with Live code editor",
};

makeLiveEditStory(Playground, {
    availableImports: { "@web-ui": { Dropdown }, react: React },
    code: `import { useState } from 'react';
import { Dropdown } from '@web-ui';

export default function Example(args) {
    const [value, setValue] = useState(args.value);
    return <Dropdown {...args} ariaLabel="Select material" value={value} onChange={setValue} />;
}`,
    modifyEditor: (monaco) => monaco.editor.setTheme("vs-dark"),
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
            render={(appearance) => <StoryDropdown {...args} {...appearance} />}
        />
    ),
};

export const InPopup: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState("brass");
        const anchorRef = useRef<HTMLDivElement>(null);

        return (
            <>
                <div ref={anchorRef} style={{ display: "inline-flex" }}>
                    <Button
                        variant="fill"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        Toggle popup with dropdown
                    </Button>
                </div>
                <Popup
                    visible={open}
                    variant="fill-inverse"
                    anchor={anchorRef}
                    triggerAnchor="bottom-left"
                    popupAnchor="top-left"
                    onClose={() => undefined}
                >
                    <div
                        style={{ padding: 20, overflow: "hidden", zIndex: 100 }}
                    >
                        <Dropdown
                            ariaLabel="Select material"
                            color="primary"
                            variant="fill-translucent"
                            value={value}
                            options={options}
                            onChange={setValue}
                        />
                    </div>
                </Popup>
            </>
        );
    },
};

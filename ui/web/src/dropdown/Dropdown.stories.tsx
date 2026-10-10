import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, FillVariant, Icons, SizeVariant, Theme } from '@ui';
import { ColorBox } from '../colors';
import { Popup } from '../popup';
import { VariantGallery } from '../storybook/VariantGallery';
import { Dropdown } from './Dropdown';
import { Button } from '../button';
import { booleanControl, colorControl, colorOptions, fillVariantControl, fillVariantOptions, optionalShadeControl, sizeControl, sizeOptions } from '../storybook/controls';

const options = [
    {
        value: 'brass',
        label: 'Brass Cog',
        prepend: <ColorBox color={Theme.palette.copper} />,
        icon: Icons.Beaker,
    },
    { value: 'copper', label: 'Copper Valve', icon: Icons.Beaker },
    { value: 'steam', label: 'Steam Pipe', icon: Icons.Beaker },
    { value: 'gear', label: 'Gear Assembly', icon: Icons.Beaker },
];

const GalleryDropdown = ({
    color,
    variant,
    size,
}: {
    color: ColorVariant;
    variant: FillVariant;
    size: SizeVariant;
}) => {
    const [value, setValue] = useState('brass');

    return (
        <Dropdown<string>
            ariaLabel={`${color} ${variant} ${size}`}
            value={value}
            options={options}
            onChange={setValue}
            color={color}
            highlightColor={color}
            variant={variant}
            size={size}
        />
    );
};

const meta = {
    title: 'Forms/Dropdown',
    component: Dropdown,
    args: {
        ariaLabel: 'Select material',
        value: 'brass',
        options,
        color: 'neutral',
        highlightColor: 'neutral',
        contentShade: 700,
        highlightContentShade: 200,
        size: 'sm',
        variant: 'fill-inverse',
        disabled: false,
        placeholder: 'Select material...',
        onChange: () => { },
    },
    argTypes: {
        color: colorControl,
        highlightColor: colorControl,
        contentShade: optionalShadeControl,
        highlightContentShade: optionalShadeControl,
        size: sizeControl,
        variant: fillVariantControl,
        disabled: booleanControl,
        onChange: { control: false },
    },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return (
            <div style={{ width: 240 }}>
                <Dropdown {...args} value={value} onChange={setValue} />
            </div>
        );
    },
};

export const Gallery: Story = {
    render: () => (
        <VariantGallery
            sizes={sizeOptions}
            colors={colorOptions}
            variants={fillVariantOptions}
            render={(options) => <GalleryDropdown {...options} />}
        />
    ),
};

export const InPopup: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState('brass');
        const anchorRef = useRef<HTMLDivElement>(null);

        return (
            <>
                <div ref={anchorRef} style={{ display: 'inline-flex' }}>
                    <Button variant="fill" onClick={() => setOpen((prev) => !prev)}>
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
                    <div style={{ padding: 20, overflow: 'hidden', zIndex: 100 }}>
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

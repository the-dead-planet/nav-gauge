import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, FillVariant, Icons, SizeVariant, Theme } from '@ui';
import { ColorBox } from '../colors';
import { Popup } from '../popup';
import { VariantGallery } from '../storybook/VariantGallery';
import { Dropdown } from './Dropdown';
import { Button } from '../button';

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

const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const sizes: SizeVariant[] = ['xs', 'sm', 'md'];
const variants: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

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
    title: 'Dropdown',
    component: Dropdown,
    args: {
        ariaLabel: 'Select material',
        value: 'brass',
        options,
        color: 'neutral',
        highlightColor: 'neutral',
        size: 'sm',
        variant: 'fill-inverse',
        disabled: false,
        placeholder: 'Select material...',
        onChange: () => { },
    },
    argTypes: {
        color: { control: 'select', options: colors },
        highlightColor: { control: 'select', options: colors },
        size: { control: 'select', options: sizes },
        variant: { control: 'select', options: variants },
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
            sizes={sizes}
            colors={colors}
            variants={variants}
            render={(options) => <GalleryDropdown {...options} />}
        />
    ),
};

export const InPopup: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState('brass');

        return (
            <>
                <Button variant="fill" onClick={() => setOpen((prev) => !prev)}>
                    Toggle popup with dropdown
                </Button>
                <Popup
                    visible={open}
                    position={{ x: 20, y: 200 }}
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

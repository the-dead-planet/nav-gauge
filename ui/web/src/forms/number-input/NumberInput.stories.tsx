import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, FillVariant, SizeVariant } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { NumberInput } from './NumberInput';

const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const sizes: SizeVariant[] = ['xs', 'sm', 'md'];
const variants: FillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

const GalleryNumberInput = ({
    color,
    variant,
    size,
}: {
    color: ColorVariant;
    variant: FillVariant;
    size: SizeVariant;
}) => {
    const [value, setValue] = useState(42);

    return (
        <NumberInput
            ariaLabel={`${color} ${variant} ${size}`}
            value={value}
            onChange={setValue}
            color={color}
            highlightColor={color}
            variant={variant}
            size={size}
            unit="px"
            autoSelect
        />
    );
};

const meta = {
    title: 'Forms/NumberInput',
    component: NumberInput,
    args: {
        id: 'number-input-playground',
        label: 'Value',
        value: 42,
        color: 'neutral',
        highlightColor: 'neutral',
        size: 'sm',
        variant: 'fill-inverse',
        min: 0,
        max: 100,
        step: 1,
        disabled: false,
        autoSelect: false,
        unit: 'px',
        showStepControls: true,
        onChange: () => {},
    },
    argTypes: {
        color: { control: 'select', options: colors },
        highlightColor: { control: 'select', options: colors },
        size: { control: 'select', options: sizes },
        variant: { control: 'select', options: variants },
        onChange: { control: false },
    },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);

        useEffect(() => setValue(args.value), [args.value]);

        return (
            <div style={{ width: 240 }}>
                <NumberInput {...args} value={value} onChange={setValue} />
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
            render={(options) => <GalleryNumberInput {...options} />}
        />
    ),
};

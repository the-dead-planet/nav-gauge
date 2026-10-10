import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, FillVariant, SizeVariant } from '@ui';
import { VariantGallery } from '../../storybook/VariantGallery';
import { NumberInput } from './NumberInput';
import { colorControl, colorOptions, fillVariantControl, fillVariantOptions, optionalShadeControl, sizeControl, sizeOptions } from '../../storybook/controls';

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
        contentShade: 700,
        highlightContentShade: 200,
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
        color: colorControl,
        highlightColor: colorControl,
        contentShade: optionalShadeControl,
        highlightContentShade: optionalShadeControl,
        size: sizeControl,
        variant: fillVariantControl,
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
            sizes={sizeOptions}
            colors={colorOptions}
            variants={fillVariantOptions}
            render={(options) => <GalleryNumberInput {...options} />}
        />
    ),
};

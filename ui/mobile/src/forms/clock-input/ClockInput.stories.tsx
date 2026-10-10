import { FC, useState } from 'react';
import { ClockInput } from './ClockInput';
import { ClockSliceInput } from './ClockSliceInput';
import { DurationClockInput } from './DurationClockInput';
import { VariantGallery } from '../../storybook/VariantGallery';

export const Gallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <ClockInput
                value={45}
                onChange={() => {}}
                color={color}
                size={size}
                variant={variant}
                label={color}
            />
        )}
    />
);

export const Playground: FC = () => {
    const [value, setValue] = useState(45);

    return <ClockInput contentShade={700} highlightContentShade={200} value={value} onChange={setValue} />;
};

export const SliceGallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <ClockSliceInput
                value={30}
                onChange={() => {}}
                color={color}
                variant={variant}
                size={size}
                label={color}
                min={0}
                max={85}
            />
        )}
    />
);

export const DurationGallery: FC = () => (
    <VariantGallery
        render={({ color, size, variant }) => (
            <DurationClockInput
                value={15000}
                onChange={() => {}}
                color={color}
                variant={variant}
                size={size}
            />
        )}
    />
);

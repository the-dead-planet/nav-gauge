import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, SurfaceFillVariant, CLOCK_INPUT_RANGE } from '@ui';
import { ClockInput } from './ClockInput';
import { ClockSliceInput } from './ClockSliceInput';
import { Text } from '../typography';
import { useState } from 'react';

const meta = {
    title: 'ClockInput',
    component: ClockInput,
} satisfies Meta<typeof ClockInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceFillVariant[] = ['fill', 'fill-inverse', 'fill-translucent'];

export const ClockInputVariants = {
    args: {
        value: 0,
    },
    render: () => {
        const [value, setValue] = useState(45);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {allSizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: size === s ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                    <button
                        onClick={() => setDisabled((d) => !d)}
                        style={{
                            padding: '4px 12px',
                            cursor: 'pointer',
                            background: disabled ? '#c44' : '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: 4,
                            fontSize: 12,
                        }}
                    >
                        disabled: {String(disabled)}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>size: {size} | value: {value}°</Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`,
                                gap: 16,
                            }}
                        >
                            {allVariants.map((variant) => (
                                <Text key={variant} style={{ textAlign: 'center', fontSize: 11 }}>
                                    {variant}
                                </Text>
                            ))}
                        </div>
                        {allColors.map((color) => (
                            <div
                                key={color}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${allVariants.length}, 1fr)`,
                                    gap: 16,
                                    marginTop: 8,
                                }}
                            >
                                {allVariants.map((variant) => (
                                    <ClockInput
                                        key={variant}
                                        value={value}
                                        onChange={setValue}
                                        color={color}
                                        variant={variant}
                                        size={size}
                                        label={color}
                                        disabled={disabled}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    },
} satisfies Story;

export const PitchConstrained = {
    args: {
        value: 30,
    },
    render: () => {
        const pitchRange: [number, number] = [0, 85];
        const [value, setValue] = useState(30);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {['xs', 'sm', 'md'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s as SizeVariant)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: size === s ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                    <button
                        onClick={() => setDisabled((d) => !d)}
                        style={{
                            padding: '4px 12px',
                            cursor: 'pointer',
                            background: disabled ? '#c44' : '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: 4,
                            fontSize: 12,
                        }}
                    >
                        disabled: {String(disabled)}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>
                            pitch range [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                        </Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${3}, 1fr)`,
                                gap: 16,
                            }}
                        >
                            {['fill', 'fill-inverse', 'fill-translucent'].map((variant) => (
                                <Text key={variant} style={{ textAlign: 'center', fontSize: 11 }}>
                                    {variant}
                                </Text>
                            ))}
                        </div>
                        {['neutral', 'primary', 'secondary', 'tertiary'].map((color) => (
                            <div
                                key={color}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${3}, 1fr)`,
                                    gap: 16,
                                    marginTop: 8,
                                }}
                            >
                                {['fill', 'fill-inverse', 'fill-translucent'].map((variant) => (
                                    <ClockInput
                                        key={variant}
                                        value={value}
                                        onChange={setValue}
                                        color={color as ColorVariant}
                                        variant={variant as SurfaceFillVariant}
                                        size={size}
                                        label={color}
                                        disabled={disabled}
                                        min={pitchRange[0]}
                                        max={pitchRange[1]}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block', marginTop: 16 }}>
                            full range [{CLOCK_INPUT_RANGE[0]}–{CLOCK_INPUT_RANGE[1]}] for comparison
                        </Text>
                        <ClockInput
                            value={value}
                            onChange={setValue}
                            size={size}
                            disabled={disabled}
                            label="full"
                        />
                    </div>
                </div>
            </div>
        );
    },
} satisfies Story;

export const PitchGauge = {
    args: {
        value: 30,
    },
    render: () => {
        const pitchRange: [number, number] = [0, 85];
        const [value, setValue] = useState(30);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {allSizes.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSize(s)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: size === s ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {s}
                        </button>
                    ))}
                    <button
                        onClick={() => setDisabled((d) => !d)}
                        style={{
                            padding: '4px 12px',
                            cursor: 'pointer',
                            background: disabled ? '#c44' : '#333',
                            color: '#fff',
                            border: '1px solid #555',
                            borderRadius: 4,
                            fontSize: 12,
                        }}
                    >
                        disabled: {String(disabled)}
                    </button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>
                            pitch [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                        </Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${allColors.length}, 1fr)`,
                                gap: 16,
                                marginTop: 8,
                            }}
                        >
                            {allColors.map((color) => (
                                <ClockSliceInput
                                    key={color}
                                    value={value}
                                    onChange={setValue}
                                    color={color}
                                    size={size}
                                    label={color}
                                    disabled={disabled}
                                    min={pitchRange[0]}
                                    max={pitchRange[1]}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Text style={{ marginBottom: 8, display: 'block', marginTop: 16 }}>
                            varying ranges
                        </Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 16,
                            }}
                        >
                            {[[0, 30], [0, 60], [0, 85]].map(([lo, hi]) => (
                                <ClockSliceInput
                                    key={`${lo}-${hi}`}
                                    value={Math.min(value, hi)}
                                    onChange={(v) => setValue(v)}
                                    color="primary"
                                    size={size}
                                    label={`${lo}–${hi}`}
                                    disabled={disabled}
                                    min={lo}
                                    max={hi}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
} satisfies Story;

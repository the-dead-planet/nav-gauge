import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, FillVariant, CLOCK_INPUT_RANGE, NumberInputPlacement } from '@ui';
import { ClockSliceInput } from './ClockSliceInput';
import { ClockInput } from './ClockInput';
import { DurationClockInput } from './DurationClockInput';
import { Text } from '../../typography';
import { useState } from 'react';
import { colorOptions as allColors, fillVariantOptions as allVariants, sizeOptions as allSizes } from '../../storybook/controls';

const meta = {
    title: 'Forms/ClockInput',
    component: ClockInput,
} satisfies Meta<typeof ClockInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const numberInputPlacements: NumberInputPlacement[] = ['start', 'end', 'above', 'below'];

const ClockInputStoryOptions = ({ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }: {
    showStepControls: boolean;
    setShowStepControls: (value: boolean) => void;
    showNumberInput: boolean;
    setShowNumberInput: (value: boolean) => void;
    numberInputPlacement: NumberInputPlacement;
    setNumberInputPlacement: (value: NumberInputPlacement) => void;
}) => (
    <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Text>Options</Text>
            <label><input type="checkbox" checked={showStepControls} onChange={(event) => setShowStepControls(event.target.checked)} /> Show plus/minus</label>
            <label><input type="checkbox" checked={showNumberInput} onChange={(event) => setShowNumberInput(event.target.checked)} /> Show number input</label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Text>Number input placement</Text>
            {numberInputPlacements.map((placement) => (
                <button key={placement} onClick={() => setNumberInputPlacement(placement)}>{placement}</button>
            ))}
        </div>
    </>
);

export const ClockInputVariants = {
    args: {
        value: 0,
    },
    render: () => {
        const [value, setValue] = useState(45);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);
        const [showStepControls, setShowStepControls] = useState(false);
        const [showNumberInput, setShowNumberInput] = useState(false);
        const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div style={{ marginBottom: 16, display: 'grid', rowGap: 12 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Text>Size</Text>
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
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Text>Disabled</Text>
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
                            {String(disabled)}
                        </button>
                    </div>
                    <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />
                </div>
                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>
                            size: {size} | value: {value}°
                        </Text>
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
                                        showNumberInput={showNumberInput}
                                        showStepControls={showStepControls}
                                        numberInputPlacement={numberInputPlacement}
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

export const SliceVariants = {
    args: {
        value: 30,
    },
    render: () => {
        const pitchRange: [number, number] = [0, 85];
        const [value, setValue] = useState(30);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);
        const [showStepControls, setShowStepControls] = useState(false);
        const [showNumberInput, setShowNumberInput] = useState(false);
        const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

        return (
            <div style={{ padding: 24, maxWidth: 800 }}>
                <div
                    style={{
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flexWrap: 'wrap',
                    }}
                >
                    <Text>Size</Text>
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
                </div>
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Text>Disabled</Text>
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
                <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
                    <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>
                            pitch [{pitchRange[0]}–{pitchRange[1]}] | value: {value}°
                        </Text>
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
                                    <ClockSliceInput
                                        key={variant}
                                        value={value}
                                        onChange={setValue}
                                        color={color}
                                        variant={variant}
                                        size={size}
                                        label={color}
                                        disabled={disabled}
                                        min={pitchRange[0]}
                                        max={pitchRange[1]}
                                        showNumberInput={showNumberInput}
                                        showStepControls={showStepControls}
                                        numberInputPlacement={numberInputPlacement}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div>
                        <Text style={{ marginBottom: 8, display: 'block', marginTop: 16 }}>varying ranges</Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 16,
                            }}
                        >
                            {[
                                [0, 30],
                                [0, 60],
                                [0, 85],
                            ].map(([lo, hi]) => (
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
                                    showNumberInput={showNumberInput}
                                    showStepControls={showStepControls}
                                    numberInputPlacement={numberInputPlacement}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <Text style={{ marginBottom: 8, display: 'block', marginTop: 16 }}>
                            full range [{CLOCK_INPUT_RANGE[0]}–{CLOCK_INPUT_RANGE[1]}] for comparison
                        </Text>
                        <ClockSliceInput value={value} onChange={setValue} size={size} disabled={disabled} label="full" />
                    </div>
                </div>
            </div>
        );
    },
} satisfies Story;

export const DurationVariants = {
    args: {
        value: 15000,
    },
    render: () => {
        const [value, setValue] = useState(15000);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [disabled, setDisabled] = useState(false);
        const [showStepControls, setShowStepControls] = useState(false);
        const [showNumberInput, setShowNumberInput] = useState(false);
        const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

        const minutes = Math.floor(value / 60000);
        const seconds = Math.round((value % 60000) / 1000);

        return (
            <div style={{ padding: 24, width: '100%', boxSizing: 'border-box' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <Text>Size</Text>
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
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <Text>Disabled</Text>
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
                <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
                    <ClockInputStoryOptions {...{ showStepControls, setShowStepControls, showNumberInput, setShowNumberInput, numberInputPlacement, setNumberInputPlacement }} />
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                        <Text style={{ marginBottom: 8, display: 'block' }}>
                            size: {size} | value: {value / 1000}s ({minutes}m {seconds}s)
                        </Text>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: showNumberInput
                                    ? 'repeat(auto-fit, minmax(300px, 1fr))'
                                    : `repeat(${allVariants.length}, 1fr)`,
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
                                    gridTemplateColumns: showNumberInput
                                        ? 'repeat(auto-fit, minmax(300px, 1fr))'
                                        : `repeat(${allVariants.length}, 1fr)`,
                                    gap: 16,
                                    marginTop: 8,
                                }}
                            >
                                {allVariants.map((variant) => (
                                    <DurationClockInput
                                        key={variant}
                                        value={value}
                                        onChange={setValue}
                                        color={color}
                                        variant={variant}
                                        size={size}
                                        disabled={disabled}
                                        showNumberInput={showNumberInput}
                                        showStepControls={showStepControls}
                                        numberInputPlacement={numberInputPlacement}
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

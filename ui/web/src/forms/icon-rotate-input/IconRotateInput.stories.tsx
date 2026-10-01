import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, Icons, NumberInputPlacement } from '@ui';
import { IconRotateInput } from './IconRotateInput';
import { Text } from '../../typography';
import { useState } from 'react';

const meta = {
    title: 'Forms/IconRotateInput',
    component: IconRotateInput,
} satisfies Meta<typeof IconRotateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const numberInputPlacements: NumberInputPlacement[] = ['start', 'end', 'above', 'below'];

export const Default = {
    args: {
        value: 0,
    },
    render: () => {
        const [angle, setAngle] = useState(0);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [color, setColor] = useState<ColorVariant>('primary');
        const [disabled, setDisabled] = useState(false);
        const [showStepControls, setShowStepControls] = useState(false);
        const [showNumberInput, setShowNumberInput] = useState(false);
        const [numberInputPlacement, setNumberInputPlacement] = useState<NumberInputPlacement>('end');

        return (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', rowGap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <Text>Color</Text>
                        {allColors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: color === c ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {c}
                        </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <Text>Options</Text>
                        <label><input type="checkbox" checked={showStepControls} onChange={(event) => setShowStepControls(event.target.checked)} /> Show plus/minus</label>
                        <label><input type="checkbox" checked={showNumberInput} onChange={(event) => setShowNumberInput(event.target.checked)} /> Show number input</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <Text>Number input placement</Text>
                        {numberInputPlacements.map((placement) => (
                        <button
                            key={placement}
                            onClick={() => setNumberInputPlacement(placement)}
                            style={{
                                padding: '4px 12px',
                                cursor: 'pointer',
                                background: numberInputPlacement === placement ? '#666' : '#333',
                                color: '#fff',
                                border: '1px solid #555',
                                borderRadius: 4,
                                fontSize: 12,
                            }}
                        >
                            {placement}
                        </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <IconRotateInput
                        icon={Icons.NounProject.CameraVideoFront}
                        value={angle}
                        onChange={setAngle}
                        color={color}
                        size={size}
                        disabled={disabled}
                        showNumberInput={showNumberInput}
                        showStepControls={showStepControls}
                        numberInputPlacement={numberInputPlacement}
                    />
                    <Text>{angle}°</Text>
                </div>
            </div>
        );
    },
} satisfies Story;

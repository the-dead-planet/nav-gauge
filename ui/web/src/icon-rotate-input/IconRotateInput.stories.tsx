import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ColorVariant, SizeVariant, SurfaceFillVariant, Icons } from '@ui';
import { IconRotateInput } from './IconRotateInput';
import { Text } from '../typography';
import { useState } from 'react';

const meta = {
    title: 'IconRotateInput',
    component: IconRotateInput,
} satisfies Meta<typeof IconRotateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];

export const Default = {
    args: {
        angle: 0,
    },
    render: () => {
        const [angle, setAngle] = useState(0);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [color, setColor] = useState<ColorVariant>('primary');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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

                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <IconRotateInput
                        icon={Icons.NounProject.CameraVideoFront}
                        angle={angle}
                        onAngleChange={setAngle}
                        color={color}
                        size={size}
                        disabled={disabled}
                    />
                    <Text>{angle}°</Text>
                </div>
            </div>
        );
    },
} satisfies Story;

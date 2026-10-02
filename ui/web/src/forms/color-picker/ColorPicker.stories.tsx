import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { Fieldset } from '../fieldset';
import { Text } from '../../typography';

const meta = {
    title: 'Forms/ColorPicker',
    component: ColorPicker,
} satisfies Meta<typeof ColorPicker>;

export default meta;

export const ColorPickerInteractive = {
    render: () => {
        const [value, setValue] = useState('rgba(255, 102, 0, 0.8)');

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, maxWidth: 320 }}>
                <ColorPicker label="Line color" opacityLabel="Opacity" value={value} onChange={setValue} />
                <Fieldset label="Theme colors">
                    <ColorPicker label="Primary" opacityLabel="Opacity" value="rgb(67, 105, 255)" size="md" onChange={setValue} />
                </Fieldset>
                <ColorPicker label="Disabled" opacityLabel="Opacity" value="#888888" disabled onChange={setValue} />
                <Text>Current value: {value}</Text>
            </div>
        );
    },
};

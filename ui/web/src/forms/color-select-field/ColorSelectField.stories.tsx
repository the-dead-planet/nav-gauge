import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { ColorSelectField } from './ColorSelectField';

const meta = {
    title: 'Forms/ColorSelectField',
    component: ColorSelectField,
} satisfies Meta<typeof ColorSelectField>;

export default meta;

export const Interactive = {
    render: () => {
        const [value, setValue] = useState('rgba(67, 105, 255, 0.75)');
        return (
            <div style={{ padding: 48 }}>
                <ColorSelectField
                    label="Color"
                    opacityLabel="Opacity"
                    value={value}
                    onChange={setValue}
                />
            </div>
        );
    },
};

import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { ColorRamp } from './ColorRamp';
import { HueRamp } from './HueRamp';
import { OpacityRamp } from './OpacityRamp';
import { SaturationValueRamp } from './SaturationValueRamp';

const meta = {
    title: 'Forms/ColorRamp',
    component: ColorRamp,
} satisfies Meta<typeof ColorRamp>;

export default meta;

export const Interactive = {
    render: () => {
        const [value, setValue] = useState('rgb(67, 105, 255)');
        return (
            <div style={{ display: 'grid', gap: 16, padding: 24 }}>
                <ColorRamp value={value} onChange={setValue} />
                <span>{value}</span>
                <ColorRamp value="#888888" size="xs" disabled onChange={() => { }} />
            </div>
        );
    },
};

export const SaturationValue = {
    render: () => {
        const [saturation, setSaturation] = useState(.7);
        const [brightness, setBrightness] = useState(.8);
        return (
            <SaturationValueRamp
                hue={210}
                saturation={saturation}
                brightness={brightness}
                onChange={(nextSaturation, nextBrightness) => {
                    setSaturation(nextSaturation);
                    setBrightness(nextBrightness);
                }}
            />
        );
    },
};

export const Hue = {
    render: () => {
        const [value, setValue] = useState(210);
        return <HueRamp value={value} onChange={setValue} />;
    },
};

export const Opacity = {
    render: () => {
        const [value, setValue] = useState(.6);
        return <OpacityRamp color="rgb(67, 105, 255)" value={value} onChange={setValue} />;
    },
};

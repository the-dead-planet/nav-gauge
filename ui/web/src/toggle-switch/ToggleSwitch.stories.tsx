import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { Text } from '../typography';
import { ColorVariant, LayoutOrientation, SizeVariant, SurfaceVariant } from '@ui';

const meta = {
    title: 'ToggleSwitch',
    component: ToggleSwitch,
} satisfies Meta<typeof ToggleSwitch>;

export default meta;

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allOrientations: LayoutOrientation[] = ['horizontal', 'vertical'];
const allVariants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];

export const ToggleSwitchVariants = {
    render: () => {
        const [checked, setChecked] = useState(false);
        const [size, setSize] = useState<SizeVariant>('sm');
        const [color, setColor] = useState<ColorVariant>('primary');
        const [variant, setVariant] = useState<SurfaceVariant>('ghost');
        const [orientation, setOrientation] = useState<LayoutOrientation>('horizontal');
        const [disabled, setDisabled] = useState(false);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
                <ToggleSwitch
                    size={size}
                    color={color}
                    variant={variant}
                    orientation={orientation}
                    checked={checked}
                    onChange={setChecked}
                    disabled={disabled}
                >
                    {checked ? 'On' : 'Off'}
                </ToggleSwitch>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <fieldset>
                        <legend>Size</legend>
                        {allSizes.map(s => (
                            <label key={s} style={{ marginRight: 8 }}>
                                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                                {s}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Color</legend>
                        {allColors.map(c => (
                            <label key={c} style={{ marginRight: 8 }}>
                                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                                {c}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Variant</legend>
                        {allVariants.map(v => (
                            <label key={v} style={{ marginRight: 8 }}>
                                <input type="radio" name="variant" checked={variant === v} onChange={() => setVariant(v)} />
                                {v}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Orientation</legend>
                        {allOrientations.map(o => (
                            <label key={o} style={{ marginRight: 8 }}>
                                <input type="radio" name="orientation" checked={orientation === o} onChange={() => setOrientation(o)} />
                                {o}
                            </label>
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>Options</legend>
                        <label style={{ marginRight: 8 }}>
                            <input type="checkbox" checked={disabled} onChange={() => setDisabled(d => !d)} />
                            disabled
                        </label>
                    </fieldset>
                </div>

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (checked)</Text>
                {allSizes.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={{ width: 40 }}>{s}</Text>
                        {allColors.map(c => (
                            <ToggleSwitch key={c} size={s} color={c} checked onChange={() => { }}>
                                {c}
                            </ToggleSwitch>
                        ))}
                    </div>
                ))}

                <Text style={{ fontWeight: 700, marginTop: 16 }}>All combinations (unchecked)</Text>
                {allSizes.map(s => (
                    <div key={s} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={{ width: 40 }}>{s}</Text>
                        {allColors.map(c => (
                            <ToggleSwitch key={c} size={s} color={c} checked={false} onChange={() => { }}>
                                {c}
                            </ToggleSwitch>
                        ))}
                    </div>
                ))}

                <Text style={{ fontWeight: 700, marginTop: 16 }}>Vertical orientation</Text>
                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {allSizes.map(s => (
                        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                            <Text>{s}</Text>
                            {allColors.map(c => (
                                <ToggleSwitch key={c} size={s} color={c} orientation="vertical" checked onChange={() => { }} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};

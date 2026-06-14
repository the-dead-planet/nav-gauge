import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Transition } from './Transition';
import { Button } from '../button';
import { Text } from '../typography';

const meta = {
    title: 'Transition',
    component: Transition,
} satisfies Meta<typeof Transition>;

export default meta;
type Story = StoryObj<typeof meta>;

const DemoBox = ({ label, color, className }: { label: string; color: string, className?: string }) => (
    <div style={{
        width: 200,
        height: 200,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    }} className={className}>
        <Text style={{ fontWeight: 700 }}>{label}</Text>
    </div>
);

const directions = ['to-top', 'to-right', 'to-bottom', 'to-left'] as const;

export const Slide = {
    render: () => {
        const [render, setRender] = useState(true);
        const [direction, setDirection] = useState<typeof directions[number]>('to-top');
        const [fade, setFade] = useState(false);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {directions.map((d) => (
                        <Button
                            key={d}
                            variant={direction === d ? 'fill' : 'ghost'}
                            color="primary"
                            size="xs"
                            corners="rounded"
                            onClick={() => setDirection(d)}
                        >
                            {d}
                        </Button>
                    ))}
                    <Button
                        variant={fade ? 'fill' : 'ghost'}
                        color="tertiary"
                        size="xs"
                        corners="rounded"
                        onClick={() => setFade((v) => !v)}
                    >
                        {fade ? 'fade: on' : 'fade: off'}
                    </Button>
                </div>

                <Button onClick={() => setRender((v) => !v)}>
                    {render ? 'Hide' : 'Show'}
                </Button>

                <Transition render={render} slide={direction} fade={fade} durationMs={400}>
                    <DemoBox label={`${direction}${fade ? ' + fade' : ''}`} color="#1a3a5c" className="a" />
                </Transition>
            </div>
        );
    },
};

import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../button';
import { DialogPlacement, DialogProps } from '@ui';

const meta = {
    title: 'Dialog',
    component: Dialog,
    args: { color: 'neutral' },
    argTypes: {
        color: { control: 'select', options: ['neutral', 'primary', 'secondary', 'tertiary'] },
    },
} satisfies Meta<typeof Dialog>;

export default meta;

const placements: DialogPlacement[] = ['middle', 'left-drawer', 'right-drawer'];

export const Overview = {
    render: ({ color }: Pick<DialogProps, 'color'>) => {
        const [open, setOpen] = useState<DialogPlacement | null>(null);

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {placements.map((p) => (
                        <Button key={p} variant="fill" color="primary" onClick={() => setOpen(p)}>
                            {p}
                        </Button>
                    ))}
                </div>

                {open && (
                    <Dialog
                        color={color}
                        header={open.replace('-', ' ')}
                        placement={open}
                        closeText="Close"
                        onClose={() => setOpen(null)}
                    >
                        <div>
                            <p>Dialog content for <strong>{open}</strong> placement.</p>
                            <p>Click Close or Save to dismiss.</p>
                        </div>
                    </Dialog>
                )}
            </div>
        );
    },
};

export const TallContent = {
    render: ({ color }: Pick<DialogProps, 'color'>) => {
        const [open, setOpen] = useState(true);

        return open ? (
            <Dialog
                color={color}
                header="tall content"
                placement="middle"
                closeText="Close"
                onClose={() => setOpen(false)}
            >
                <div>
                    {Array.from({ length: 40 }, (_, i) => (
                        <p key={i}>Long dialog content line {i + 1}.</p>
                    ))}
                </div>
            </Dialog>
        ) : null;
    },
};

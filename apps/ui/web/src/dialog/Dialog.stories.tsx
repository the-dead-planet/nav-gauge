import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../button';
import { DialogPlacement } from '@ui';

const meta = {
    title: 'Dialog',
    component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const placements: DialogPlacement[] = ['middle', 'left-drawer', 'right-drawer'];

export const Overview = {
    render: () => {
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
                        header={open.replace('-', ' ')}
                        placement={open}
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

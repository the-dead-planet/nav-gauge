import type { Meta } from 'storybook-react-rsbuild';
import { useState } from 'react';
import { Popup } from './Popup';
import { Button } from '../button';

const meta = {
    title: 'Popup',
    component: Popup,
} satisfies Meta<typeof Popup>;

export default meta;

export const Overview = {
    render: () => {
        const [visible, setVisible] = useState(false);
        const anchorRef = useState<HTMLButtonElement | null>(null)[1];

        return (
            <div style={{ padding: 100 }}>
                <button ref={anchorRef} onClick={() => setVisible((v) => !v)} style={{ padding: '8px 16px' }}>
                    Toggle Popup
                </button>
                <Popup visible={visible} onClose={() => setVisible(false)} anchor={anchorRef as unknown as React.RefObject<HTMLElement | null>}>
                    <div style={{ padding: 16, border: '1px solid var(--color-neutral-500)', background: 'var(--color-neutral-200)', borderRadius: 6 }}>
                        <p>Popup content</p>
                        <Button size="xs" onClick={() => setVisible(false)}>Close</Button>
                    </div>
                </Popup>
            </div>
        );
    },
};

import type { Meta } from 'storybook-react-rsbuild';
import { useRef, useState } from 'react';
import { Popup } from './Popup';
import { Button } from '../button';
import type { MenuAnchor } from '@ui';

const meta = {
    title: 'Popup',
    component: Popup,
} satisfies Meta<typeof Popup>;

export default meta;

const placements: MenuAnchor[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export const Overview = {
    render: () => {
        const [visible, setVisible] = useState<MenuAnchor | null>(null);
        const anchorRefs = useRef<Record<MenuAnchor, HTMLButtonElement | null>>({
            'top-left': null,
            'top-right': null,
            'bottom-left': null,
            'bottom-right': null,
        });

        return (
            <div style={{ padding: 100, display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 32 }}>
                {placements.map((placement) => (
                    <button
                        key={placement}
                        ref={(element) => { anchorRefs.current[placement] = element; return; }}
                        onClick={() => setVisible((current) => (current === placement ? null : placement))}
                        style={{ padding: '8px 16px' }}
                    >
                        {placement}
                    </button>
                ))}
                {visible && (
                    <Popup
                        visible
                        variant="fill"
                        onClose={() => setVisible(null)}
                        anchor={{ current: anchorRefs.current[visible] }}
                        placement={visible}
                    >
                        <div>
                            <p>Popup content</p>
                            <Button size="xs" onClick={() => setVisible(null)}>Close</Button>
                        </div>
                    </Popup>
                )}
            </div>
        );
    },
};

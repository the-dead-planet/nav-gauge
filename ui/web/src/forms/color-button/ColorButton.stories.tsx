import type { Meta } from 'storybook-react-rsbuild';
import { ColorButton } from './ColorButton';

const meta = {
    title: 'Forms/ColorButton',
    component: ColorButton,
} satisfies Meta<typeof ColorButton>;

export default meta;

export const Colors = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, padding: 24 }}>
            <ColorButton value="#336699" />
            <ColorButton value="rgb(255, 102, 0)" selected />
            <ColorButton value="rgba(67, 105, 255, 0.5)" size="md" />
            <ColorButton value="#888888" disabled />
        </div>
    ),
};

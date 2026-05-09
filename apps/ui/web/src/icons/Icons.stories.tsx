import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import * as Icons from './';

const meta = {
    title: 'Icons'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
    args: {},
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content', alignItems: 'center', gap: 10 }}>
            <p>Find</p>
            <img src={Icons.Find} width={20} />
        </div>
    ),
} satisfies Story;

import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Color } from './Color';
import { Theme } from '@ui';

const meta = {
  title: 'Colors',
} satisfies Meta<typeof Color>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorPalette = {
  render: () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: ' max-content max-content',
      alignItems: 'center',
      columnGap: '20px',
    }}>
      {Object.entries(Theme.palette).map(([name, color]) => <Color key={name} name={name} color={color} />)}
    </div>
  ),
} satisfies Story;

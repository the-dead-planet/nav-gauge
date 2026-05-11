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
      <Color name="Grey" color={Theme.palette.grey} />
      <Color name="Yellow" color={Theme.palette.yellow} />
      <Color name="Copper" color={Theme.palette.copper} />
      <Color name="Red" color={Theme.palette.red} />
      <Color name="Pink" color={Theme.palette.pink} />
      <Color name="Magenta" color={Theme.palette.magenta} />
      <Color name="Purple" color={Theme.palette.purple} />
      <Color name="Teal" color={Theme.palette.teal} />
      <Color name="Lime" color={Theme.palette.lime} />
      <Color name="Blue" color={Theme.palette.blue} />
    </div>
  ),
} satisfies Story;

import { FC } from 'react';
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
      <Color name="Blue" color={Theme.palette.blue} />
      <Color name="Copper" color={Theme.palette.copper} />
      <Color name="Grey" color={Theme.palette.grey} />
      <Color name="Lime" color={Theme.palette.lime} />
      <Color name="Magenta" color={Theme.palette.magenta} />
      <Color name="Pink" color={Theme.palette.pink} />
      <Color name="Purple" color={Theme.palette.purple} />
      <Color name="Red" color={Theme.palette.red} />
      <Color name="Teal" color={Theme.palette.teal} />
      <Color name="Yellow" color={Theme.palette.yellow} />
    </div>
  ),
} satisfies Story;

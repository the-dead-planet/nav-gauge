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
  render: () => <Color color={Theme.palette.blue} />,
} satisfies Story;

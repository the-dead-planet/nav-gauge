import { sizeOptions } from '../../design-system';
import { StoryControls } from '../../storybook';
import { TileProps } from './model';

export const tileStoryArgs = {
    name: 'Navigation controls',
    description: 'Controls for moving around the map and route.',
    size: 'sm',
} satisfies TileProps;

export const tileStoryControls = {
    name: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'select', options: sizeOptions },
} satisfies StoryControls<TileProps>;

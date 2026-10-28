import {
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    fillVariantOptions,
} from '../../design-system';
import { StoryControls } from '../../storybook';
import { DialogPlacement, DialogProps } from './model';

export const dialogPlacementOptions: DialogPlacement[] = [
    'middle',
    'left-drawer',
    'right-drawer',
];
export const dialogStoryArgs: Omit<DialogProps, 'onClose'> = {
    header: 'Mission control',
    closeText: 'Close',
    children: 'Configure your next expedition.',
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    placement: 'middle',
};
export const dialogStoryControls: StoryControls<DialogProps> = {
    header: { control: 'text' },
    closeText: { control: 'text' },
    children: { control: 'text' },
    color: { control: 'select', options: appearanceColorOptions },
    variant: { control: 'select', options: fillVariantOptions },
    placement: { control: 'select', options: dialogPlacementOptions },
};

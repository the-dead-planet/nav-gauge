import {
    appearanceColorOptions,
    DEFAULT_COLOR,
    DEFAULT_FILL_VARIANT,
    fillVariantOptions,
} from '../../design-system';
import { StoryControls } from '../../storybook';
import { PopupProps } from './model';
import { menuAnchorOptions } from '../menu/tinkers';

export const popupStoryArgs: Omit<PopupProps, 'onClose' | 'visible'> = {
    children: 'Expedition details',
    color: DEFAULT_COLOR,
    variant: DEFAULT_FILL_VARIANT,
    triggerAnchor: 'bottom-left',
    popupAnchor: 'top-left',
    dismissOnClickAway: true,
};
export const popupStoryControls: StoryControls<PopupProps> = {
    children: { control: 'text' },
    color: { control: 'select', options: appearanceColorOptions },
    variant: { control: 'select', options: fillVariantOptions },
    triggerAnchor: { control: 'select', options: menuAnchorOptions },
    popupAnchor: { control: 'select', options: menuAnchorOptions },
    dismissOnClickAway: { control: 'boolean' },
};

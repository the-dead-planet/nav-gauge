import { allColorShades, appearanceColorOptions, fillVariantOptions, sizeOptions } from '../../design-system';
import { StoryControls } from '../../storybook';
import { ToggleSwitchProps } from './model';

export const toggleSwitchOrientations = ['horizontal', 'vertical'] as const;

export const toggleSwitchStoryArgs = {
    children: 'Toggle switch',
    checked: false,
    color: 'neutral',
    variant: 'fill-inverse',
    size: 'sm',
    orientation: 'horizontal',
    active: false,
    disabled: false,
} satisfies Omit<ToggleSwitchProps, 'onChange'>;

export const toggleSwitchStoryControls: StoryControls<ToggleSwitchProps> = {
    children: {
        control: 'text',
    },
    checked: {
        control: 'boolean'
    },
    color: {
        control: 'select',
        options: appearanceColorOptions,
    },
    contentShade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: { Default: undefined },
    },
    highlightColor: {
        control: 'select',
        options: ['Default', ...appearanceColorOptions],
        mapping: { Default: undefined },
    },
    highlightContentShade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: { Default: undefined },
    },
    variant: {
        control: 'select',
        options: fillVariantOptions,
    },
    size: {
        control: 'select',
        options: sizeOptions,
    },
    orientation: {
        control: 'select', options: toggleSwitchOrientations,
    },
    active: {
        control: 'boolean'
    },
    disabled: {
        control: 'boolean'
    },
};

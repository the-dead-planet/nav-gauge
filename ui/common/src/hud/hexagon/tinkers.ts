import { HexagonProps } from './model';
import { activeGlowOptions, appearanceColorOptions, sizeOptions, surfaceVariantOptions } from '../../design-system';
import { StoryControls } from '../../storybook';

export const hexagonShapes = ['pointy-top', 'flat-top'] as const;

export const hexagonStoryArgs = {
    children: 'H',
    color: 'primary',
    variant: 'ghost',
    size: 'md',
    shape: 'pointy-top',
    strokeWidth: 2,
    interactive: true,
    highlighted: false,
    disabled: false,
    activeGlow: 'none',
} satisfies HexagonProps;

export const hexagonStoryControls: StoryControls<HexagonProps> = {
    children: {
        control: 'text',
    },
    color: {
        control: 'select',
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: 'select',
        options: ['Default', ...appearanceColorOptions],
        mapping: { Default: undefined },
    },
    variant: {
        control: 'select',
        options: surfaceVariantOptions,
    },
    size: {
        control: 'select',
        options: sizeOptions,
    },
    shape: {
        control: 'select',
        options: hexagonShapes,
    },
    strokeWidth: {
        control: {
            type: 'range',
            min: 1,
            max: 8,
            step: 1,
        },
    },
    interactive: {
        control: 'boolean',
    },
    highlighted: {
        control: 'boolean',
    },
    disabled: {
        control: 'boolean',
    },
    activeGlow: {
        control: 'select',
        options: activeGlowOptions,
    },
};

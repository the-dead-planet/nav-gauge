import { ButtonProps } from './model';
import { activeGlowOptions, allColorShades, appearanceColorOptions, sizeOptions, surfaceVariantOptions } from '../../design-system';
import { StoryControls } from '../../storybook';

export const buttonCorners = ['square', 'circle', 'hexagon'] as const;
export const buttonTooltipPlacements = ['auto', 'top', 'right', 'bottom', 'left'] as const;

export const buttonStoryArgs = {
    children: 'Button',
    color: 'neutral',
    variant: 'ghost',
    activeGlow: 'none',
    size: 'sm',
    corners: 'square',
    highlighted: false,
    disabled: false,
    tooltip: '',
    showTooltipConnection: false,
    iconRotateX: 0,
    iconRotateZ: 0,
} satisfies ButtonProps;

export const buttonStoryControls: StoryControls<ButtonProps> = {
    children: {
        control: 'text',
    },
    color: {
        control: 'select',
        options: appearanceColorOptions,
    },
    glyphsShade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: { Default: undefined },
    },
    highlightColor: {
        control: 'select',
        options: ['Default', ...appearanceColorOptions],
        mapping: { Default: undefined },
    },
    highlightGlyphsShade: {
        control: 'select',
        options: ['Default', ...allColorShades],
        mapping: { Default: undefined },
    },
    variant: {
        control: 'select',
        options: surfaceVariantOptions,
    },
    activeGlow: {
        control: 'select',
        options: activeGlowOptions,
    },
    size: {
        control: 'select',
        options: sizeOptions,
    },
    corners: {
        control: 'select',
        options: buttonCorners,
    },
    highlighted: {
        control: 'boolean',
    },
    disabled: {
        control: 'boolean',
    },
    tooltipPlacement: {
        control: 'select',
        options: ['Default', ...buttonTooltipPlacements],
        mapping: { Default: undefined },
    },
    tooltip: {
        control: 'text',
    },
    showTooltipConnection: {
        control: 'boolean',
    },
    iconRotateX: {
        control: {
            type: 'range',
            min: 0,
            max: 360,
            step: 1,
        },
    },
    iconRotateZ: {
        control: {
            type: 'range',
            min: 0,
            max: 360,
            step: 1,
        },
    },
};

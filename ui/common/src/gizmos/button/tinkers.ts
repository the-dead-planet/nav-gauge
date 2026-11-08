import { ButtonProps } from './model';
import {
    activeGlowOptions,
    allColorShades,
    appearanceColorOptions,
    CornerVariant,
    DEFAULT_COLOR,
    sizeOptions,
    surfaceVariantOptions,
    typographyStoryControls,
    typographyUsageSpecifications,
} from '../../design-system';
import { StoryControls } from '../../storybook';
import { TooltipPlacement } from '../tooltip';

export const buttonCorners: CornerVariant[] = ['square', 'circle', 'hexagon'];
export const buttonTooltipPlacements: TooltipPlacement[] = ['auto', 'top', 'right', 'bottom', 'left'];

export const buttonCaptionLayout = {
    minHeight: typographyUsageSpecifications.caption.lineHeight * 2,
    width: 48,
    gap: 2,
};

export const buttonStoryArgs = {
    children: 'Button',
    caption: '',
    captionNowrap: false,
    fontType: undefined,
    color: DEFAULT_COLOR,
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
    fontType: typographyStoryControls.fontType,
    children: {
        control: 'text',
    },
    caption: {
        control: 'text',
    },
    captionNowrap: {
        control: 'boolean',
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

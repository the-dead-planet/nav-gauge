import { SizeVariant } from "../../design-system/model";
import { DEFAULT_SIZE, sizeOptions } from "../../design-system";
import { StoryControls } from "../../storybook";
import {
    ColorRampProps,
    HueRampProps,
    OpacityRampProps,
    SaturationValueRampProps,
} from "./model";

export const saturationValueRampHeights: Record<SizeVariant, number> = {
    xs: 100,
    sm: 140,
    md: 180,
    lg: 220,
};

export const colorRampStoryArgs: Omit<ColorRampProps, "onChange"> = {
    value: "rgba(51, 102, 153, 0.8)",
    label: "Color",
    opacityLabel: "Opacity",
    size: DEFAULT_SIZE,
    disabled: false,
};

export const colorRampStoryControls: StoryControls<ColorRampProps> = {
    value: {
        control: "text",
    },
    label: {
        control: "text",
    },
    opacityLabel: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    disabled: {
        control: "boolean",
    },
};

export const hueRampStoryArgs: Omit<HueRampProps, "onChange"> = {
    value: 210,
    label: "Color",
    size: DEFAULT_SIZE,
    disabled: false,
};

export const hueRampStoryControls: StoryControls<HueRampProps> = {
    value: {
        control: {
            type: "range",
            min: 0,
            max: 360,
            step: 1,
        },
    },
    label: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    disabled: {
        control: "boolean",
    },
};

export const opacityRampStoryArgs: Omit<OpacityRampProps, "onChange"> = {
    color: "#336699",
    value: 0.6,
    label: "Opacity",
    size: DEFAULT_SIZE,
    disabled: false,
};

export const opacityRampStoryControls: StoryControls<OpacityRampProps> = {
    color: {
        control: "text",
    },
    value: {
        control: {
            type: "range",
            min: 0,
            max: 1,
            step: 0.01,
        },
    },
    label: {
        control: "text",
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    disabled: {
        control: "boolean",
    },
};

export const saturationValueRampStoryArgs: Omit<
    SaturationValueRampProps,
    "onChange"
> = {
    hue: 210,
    saturation: 0.7,
    brightness: 0.8,
    label: "Color",
    size: DEFAULT_SIZE,
    disabled: false,
};

export const saturationValueRampStoryControls: StoryControls<SaturationValueRampProps> =
    {
        hue: {
            control: {
                type: "range",
                min: 0,
                max: 360,
                step: 1,
            },
        },
        saturation: {
            control: {
                type: "range",
                min: 0,
                max: 1,
                step: 0.01,
            },
        },
        brightness: {
            control: {
                type: "range",
                min: 0,
                max: 1,
                step: 0.01,
            },
        },
        label: {
            control: "text",
        },
        size: {
            control: "select",
            options: sizeOptions,
        },
        disabled: {
            control: "boolean",
        },
    };

export const colorRampThumbSizes: Record<SizeVariant, number> = {
    xs: 12,
    sm: 16,
    md: 18,
    lg: 24,
};

export const sliderRampHeights: { [key in SizeVariant]: number } = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
};

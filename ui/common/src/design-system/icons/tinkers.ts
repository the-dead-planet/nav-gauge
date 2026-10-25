import { StoryControls } from "../../storybook/model";
import { appearanceColorOptions, sizeOptions } from "../tinkers";
import { allColorShades } from "../theme/tinkers";
import { Theme } from "../theme/theme";
import { ThemeAppearanceState } from "../theme/model";
import { IconAppearanceProps } from "./model";

export const resolveIconState = ({
    disabled,
    highlighted,
    appearanceState = "default",
}: IconAppearanceProps): ThemeAppearanceState =>
    disabled || appearanceState === "disabled"
        ? "disabled"
        : highlighted
          ? "active-pressed"
          : appearanceState;

export const resolveIconGlyphs = (
    theme: Theme,
    props: IconAppearanceProps,
): string => {
    const state = resolveIconState(props);
    const color =
        appearanceColorOptions.find((option) => option === props.color) ??
        "neutral";
    const highlightColor = props.highlightColor ?? color;
    const appearance = theme.resolveAppearance(
        undefined,
        color,
        highlightColor,
        state,
    );
    if (state === "disabled") {
        return appearance.glyphs;
    }
    const interactive = state === "hover-focus" || state === "active-pressed";
    const shade = interactive ? props.highlightGlyphsShade : props.glyphsShade;
    if (shade !== undefined) {
        return theme.color(interactive ? highlightColor : color, shade);
    }
    return !interactive && props.color !== undefined && props.color !== color
        ? props.color
        : appearance.glyphs;
};

export const iconStoryArgs: IconAppearanceProps = {
    color: "neutral",
    size: "sm",
    highlighted: false,
    disabled: false,
};

export const iconStoryControls: StoryControls<IconAppearanceProps> = {
    color: {
        control: "select",
        options: appearanceColorOptions,
    },
    highlightColor: {
        control: "select",
        options: ["Default", ...appearanceColorOptions],
        mapping: {
            Default: undefined,
        },
    },
    size: {
        control: "select",
        options: sizeOptions,
    },
    glyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    highlightGlyphsShade: {
        control: "select",
        options: ["Default", ...allColorShades],
        mapping: {
            Default: undefined,
        },
    },
    highlighted: {
        control: "boolean",
    },
    disabled: {
        control: "boolean",
    },
};

import { ComponentType, FC } from "react";
import { SvgProps } from "react-native-svg";
import {
    DEFAULT_SIZE,
    IconAppearanceProps,
    resolveIconGlyphs,
    resolveIconState,
    useTheme,
} from "@ui";

interface Props extends Omit<IconAppearanceProps, "color"> {
    icon: ComponentType<SvgProps>;
    color?: SvgProps["color"];
}

export const Icon: FC<Props & Omit<SvgProps, keyof Props>> = ({
    icon: RenderIcon,
    color,
    fill,
    stroke,
    size = DEFAULT_SIZE,
    width,
    height,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled,
    appearanceState,
    accessible = false,
    accessibilityState,
    ...props
}) => {
    const theme = useTheme();
    const appearanceProps: IconAppearanceProps = {
        color: typeof color === "string" ? color : undefined,
        highlightColor,
        glyphsShade,
        highlightGlyphsShade,
        highlighted,
        disabled,
        appearanceState,
    };
    const state = resolveIconState(appearanceProps);
    const glyphs =
        state === "default" && typeof color === "object"
            ? color
            : resolveIconGlyphs(theme, appearanceProps);
    const isDisabled = state === "disabled";

    return (
        <RenderIcon
            accessible={accessible}
            accessibilityRole={accessible ? "image" : undefined}
            accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
            width={width ?? theme.sizes.control[size].iconSize}
            height={height ?? theme.sizes.control[size].iconSize}
            fill={isDisabled ? glyphs : (fill ?? glyphs)}
            stroke={isDisabled && stroke !== undefined ? glyphs : stroke}
            color={glyphs}
            {...props}
        />
    );
};

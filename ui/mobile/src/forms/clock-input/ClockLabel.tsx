import { FC } from "react";
import { ColorShade, ColorVariant, FontType } from "@ui";
import { Label } from "../../design-system/typography";

interface Props {
    label?: string;
    value: number;
    formatValue?: (value: number) => string;
    showValue: boolean;
    color: ColorVariant;
    highlightColor: ColorVariant;
    glyphsShade?: ColorShade;
    highlightGlyphsShade?: ColorShade;
    highlighted: boolean;
    disabled: boolean;
}

export const ClockLabel: FC<Props> = ({
    label,
    value,
    formatValue,
    showValue,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled,
}) =>
    label ? (
        <Label
            color={color}
            highlightColor={highlightColor}
            shade={glyphsShade}
            highlightShade={highlightGlyphsShade}
            highlighted={highlighted}
            disabled={disabled}
        >
            {label}{" "}
            {showValue ? (
                <Label
                    color={color}
                    highlightColor={highlightColor}
                    shade={glyphsShade}
                    highlightShade={highlightGlyphsShade}
                    highlighted={highlighted}
                    disabled={disabled}
                    fontType={FontType.Numeric}
                    tabular
                >
                    {formatValue?.(value) ?? `${value}°`}
                </Label>
            ) : null}
        </Label>
    ) : null;

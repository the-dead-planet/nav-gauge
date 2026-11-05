import { FC } from "react";
import { IconRotateInputProps } from "@ui";
import { Label } from "../../design-system/typography";

interface Props extends Omit<IconRotateInputProps, "value"> {
    displayWrapped: number;
    showValue: boolean;
}

export const RotateLabel: FC<Props> = ({
    label,
    displayWrapped,
    showValue,
    themeMode,
    color,
    highlightColor,
    glyphsShade,
    highlightGlyphsShade,
    highlighted,
    disabled,
}) =>
    label ? (
        <Label
            themeMode={themeMode}
            color={color}
            highlightColor={highlightColor}
            shade={glyphsShade}
            highlightShade={highlightGlyphsShade}
            highlighted={highlighted}
            disabled={disabled}
        >
            {label} {showValue ? `${displayWrapped}°` : null}
        </Label>
    ) : null;

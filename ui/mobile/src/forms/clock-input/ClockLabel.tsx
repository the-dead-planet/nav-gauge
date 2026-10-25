import { FC } from "react";
import { View } from "react-native";
import { ColorShade, ColorVariant, DEFAULT_COLOR, FontType } from "@ui";
import { Text } from "../../design-system/typography";

interface Props {
    label?: string;
    value: number;
    isLight: boolean;
    showValue?: boolean;
    color?: ColorVariant;
    glyphsShade?: ColorShade;
}

export const ClockLabel: FC<Props> = ({
    label,
    value,
    isLight,
    showValue = true,
    color = DEFAULT_COLOR,
    glyphsShade,
}) => {
    if (!label) {
        return null;
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text color={color} shade={glyphsShade ?? (isLight ? 800 : 200)} style={{
                fontSize: 11,
                fontWeight: '500',
                letterSpacing: 0.4,
                marginBottom: 2,
            }}>
                {label}
            </Text>
            {showValue ? (
                <View style={{ minWidth: 40, alignItems: 'flex-end' }}>
                    <Text color={color} shade={glyphsShade ?? (isLight ? 800 : 200)} fontType={FontType.Numeric} tabular style={{
                        fontSize: 10,
                        opacity: 0.7,
                    }}>
                        {value}°
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

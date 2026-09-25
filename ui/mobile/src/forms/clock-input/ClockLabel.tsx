import { FC } from "react";
import { View } from "react-native";
import { FontType } from "@ui";
import { Text } from "../../typography";

interface Props {
    label?: string;
    value: number;
    isLight: boolean;
}

export const ClockLabel: FC<Props> = ({
    label,
    value,
    isLight,
}) => {
    if (!label) {
        return null;
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text color="neutral" shade={isLight ? 800 : 200} style={{
                fontSize: 11,
                fontWeight: '500',
                letterSpacing: 0.4,
                marginBottom: 2,
            }}>
                {label}
            </Text>
            <View style={{ minWidth: 40, alignItems: 'flex-end' }}>
                <Text color="neutral" shade={isLight ? 800 : 200} fontType={FontType.Numeric} tabular style={{
                    fontSize: 10,
                    opacity: 0.7,
                }}>
                    {value}°
                </Text>
            </View>
        </View>
    );
};

import { FC } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@ui";

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
    const theme = useTheme();

    if (!label) {
        return null;
    }

    const labelColor = theme.color('neutral', isLight ? 800 : 200);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{
                fontSize: 11,
                fontWeight: '500',
                letterSpacing: 0.4,
                color: labelColor,
                marginBottom: 2,
            }}>
                {label}
            </Text>
            <View style={{ minWidth: 40, alignItems: 'flex-end' }}>
                <Text style={{
                    fontSize: 10,
                    fontVariant: ['tabular-nums'],
                    color: labelColor,
                    opacity: 0.7,
                }}>
                    {value}°
                </Text>
            </View>
        </View>
    );
};

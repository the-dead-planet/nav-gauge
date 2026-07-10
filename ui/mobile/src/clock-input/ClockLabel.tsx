import { FC } from "react";
import { View, Text, TextStyle } from "react-native";

interface Props {
    label?: string;
    value: number;
    labelStyle: TextStyle;
    valueStyle: TextStyle;
}

export const ClockLabel: FC<Props> = ({
    label,
    value,
    labelStyle,
    valueStyle,
}) => {
    if (!label) {
        return null;
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={labelStyle}>{label}</Text>
            <View style={{ minWidth: 40, alignItems: 'flex-end' }}>
                <Text style={valueStyle}>{value}°</Text>
            </View>
        </View>
    );
};

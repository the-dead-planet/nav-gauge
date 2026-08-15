import { FC } from "react";
import { View, ViewStyle } from "react-native";

interface LampProps {
    color: string;
    size: number;
    opacity: number;
    glowColor?: string;
}

export const Lamp: FC<LampProps> = ({ color, size, opacity, glowColor }) => {
    const baseStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
    };

    const glowSize = size + 6;

    const glowStyle: ViewStyle = {
        position: 'absolute',
        width: glowSize,
        height: glowSize,
        borderRadius: glowSize / 2,
        top: (size - glowSize) / 2,
        left: (size - glowSize) / 2,
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 4,
    };

    return (
        <View style={baseStyle}>
            {glowColor ? <View style={glowStyle} /> : null}
        </View>
    );
};

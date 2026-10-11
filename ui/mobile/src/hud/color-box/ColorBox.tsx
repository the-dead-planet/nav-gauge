import { FC } from 'react';
import { View } from 'react-native';
import { ColorBoxProps } from '@ui';

export const ColorBox: FC<ColorBoxProps> = ({
    color,
    shade = 500,
    size = 12,
}) => {
    const { r, g, b } = color[shade];
    return (
        <View
            style={{
                width: size,
                height: size,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
            }}
        />
    );
};

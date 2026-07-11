import { ComponentType, FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";
import { Icon } from "../icons";

interface Props {
    icon?: ComponentType<SvgProps>;
    iconSize: number;
    svgSize: number;
    displayAngle: number;
    iconColor: string;
}

export const RotateIconWrapper: FC<Props> = ({
    icon,
    iconSize,
    svgSize,
    displayAngle,
    iconColor,
}) => (
    <View
        style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: svgSize,
            height: svgSize,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: `${displayAngle}deg` }],
        }}
    >
        {icon ? (
            <Icon
                icon={icon}
                width={iconSize}
                height={iconSize}
                color={iconColor}
            />
        ) : null}
    </View>
);

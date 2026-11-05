import { ComponentType, FC } from "react";
import { StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { Icon } from "../../design-system/icons";

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
    },
});

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
        pointerEvents="none"
        style={[
            styles.wrapper,
            {
                width: svgSize,
                height: svgSize,
                transform: [{ rotate: `${displayAngle}deg` }],
            },
        ]}
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

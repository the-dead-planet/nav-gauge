import { ComponentType, FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";
import { useTheme } from "@ui";
import { Icon } from "../../design-system/icons";
import { Text } from "../../design-system/typography";

interface Props {
    label?: string;
    displayWrapped: number;
    icon?: ComponentType<SvgProps>;
    showValue?: boolean;
}

export const RotateLabel: FC<Props> = ({
    label,
    displayWrapped,
    icon,
    showValue = true,
}) => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance();

    return label ? (
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
            {icon ? (
                <Icon
                    icon={icon}
                    width={10}
                    height={10}
                    color={appearance.glyphs}
                />
            ) : null}
            <Text style={{ fontSize: 11, color: appearance.glyphs }}>
                {label} {showValue ? `${displayWrapped}°` : null}
            </Text>
        </View>
    ) : null;
};

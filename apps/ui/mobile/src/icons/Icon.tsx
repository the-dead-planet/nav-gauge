import { ComponentType, FC } from "react";
import { SvgProps } from "react-native-svg";
import { useTheme } from "@ui";

interface Props {
    icon: ComponentType<SvgProps>;
}

export const Icon: FC<Props & SvgProps> = ({ icon: RenderIcon, ...props }) => {
    const theme = useTheme();
    const color = theme.componentColor('text');

    return <RenderIcon color={color} fill={color} {...props} />
};

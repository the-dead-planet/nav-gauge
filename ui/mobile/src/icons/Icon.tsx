import { ComponentType, FC } from "react";
import { SvgProps } from "react-native-svg";
import { useTheme } from "@ui";

interface Props {
    icon: ComponentType<SvgProps>;
}

export const Icon: FC<Props & SvgProps> = ({ icon: RenderIcon, color, fill, ...props }) => {
    const theme = useTheme();

    return (
        <RenderIcon
            fill={fill || color || theme.componentColor('text')}
            color={color || theme.componentColor('text')}
            {...props}
        />
    );
};

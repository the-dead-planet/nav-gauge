import { ComponentType, FC } from "react";
import { SvgProps } from "react-native-svg";
import { useTheme } from "@ui";

interface Props {
    icon: ComponentType<SvgProps>;
}

export const Icon: FC<Props & SvgProps> = ({
    icon: RenderIcon,
    color,
    fill,
    ...props
}) => {
    const theme = useTheme();

    return (
        <RenderIcon
            fill={fill || color || theme.color('neutral', theme.isLight ? 900 : 100)}
            color={color || theme.color('neutral', theme.isLight ? 900 : 100)}
            {...props}
        />
    );
};

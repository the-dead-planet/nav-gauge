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
    const appearance = theme.resolveAppearance();

    return (
        <RenderIcon
            fill={fill || color || appearance.glyphs}
            color={color || appearance.glyphs}
            {...props}
        />
    );
};

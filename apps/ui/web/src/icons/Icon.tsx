import { FC } from "react";
import { ReactSVG } from 'react-svg';
import { IconProps } from "./model";
import { useTheme } from "@ui";

interface Props {
    src: string;
}

export const Icon: FC<Props & IconProps> = ({ src, ...props }) => {
    const theme = useTheme();
    const color = theme.componentColor('text');
    console.log({color})

    return (
        <ReactSVG
            src={src}
            fallback={props.fallback || (() => <div>error</div>)}
            width={24}
            height={24}
            wrapper="svg"
            color={color}
            stroke={color}
            fill={color}
            {...props}
        />
    );
};

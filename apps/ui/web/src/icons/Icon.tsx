import { FC } from "react";
import { ReactSVG } from 'react-svg';
import { IconProps } from "./model";

interface Props {
    src: string;
}

export const Icon: FC<Props & IconProps> = ({ src, ...props }) => {
    return (
        <ReactSVG
            src={src}
            fallback={props.fallback || (() => <div>error</div>)}
            width={24}
            height={24}
            wrapper="svg"
            {...props}
        />
    );
};

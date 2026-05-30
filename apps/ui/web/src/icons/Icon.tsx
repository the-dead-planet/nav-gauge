import { FC } from "react";
import { ReactSVG } from 'react-svg';
import { IconProps } from "./model";

interface Props {
    src: string;
}

export const Icon: FC<Props & IconProps> = ({ src, width = 24, height = 24, strokeWidth , ...props }) => {
    const color = props.color;
    const fill = props.fill || color;
    const stroke = props.stroke || color;

    return (
        <ReactSVG
            src={src}
            fallback={props.fallback || (() => <div>error</div>)}
            wrapper="span"
            beforeInjection={(svg) => {
                svg.setAttribute('style', `
                    width:${width}px;
                    height:${height}px;
                    fill:${fill || 'inherit'};
                    stroke:${stroke || 'inherit'};
                    color:${color || 'inherit'};
                    stroke-width:${strokeWidth || 'inherit'}px
                `)
            }}
            {...props}
        />
    );
};

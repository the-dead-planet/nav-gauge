import { FC } from "react";
import { ReactSVG } from 'react-svg';
import classNames from "classnames";
import { IconProps } from "./model";
import { Icons } from "@ui";
import styles from './icon.module.css';

interface Props {
    src: string;
    /**
     * Defaults to "true"
     */
    ariaHidden?: boolean;
}

export const Icon: FC<Props & IconProps> = ({ src, width = 24, height = 24, strokeWidth, ariaHidden = true, className, ...props }) => {
    const color = props.color;
    const fill = props.fill || color;
    const stroke = props.stroke || color;

    return (
        <ReactSVG
            src={src}
            fallback={props.fallback || (() => <Icon {...props} width={width} height={height} strokeWidth={strokeWidth} src={Icons.NounProject.Crash} fallback={() => <span>Err!</span>} />)}
            wrapper="span"
            aria-hidden={ariaHidden}
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
            className={classNames(styles['icon'], className)}
            {...props}
        />
    );
};
